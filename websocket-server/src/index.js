import http from 'http';
import socketio from 'socket.io';
import * as spotifyController from './spotifyController';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import config from './config';

AWS.config.update({ ...config.aws });

const server = http.createServer();
const io = socketio(server);
const clients = [];
const rooms = [];
const dynamo = new AWS.DynamoDB();
const lambda = new AWS.Lambda();
const validate = {
    chatMessage: (msg) => {
        try {
            return msg.match(/^\s*(.{0,249}\S)\s*$/);
        }
        catch (e) {
            return false;
        }
    },
    trackUri: (uri) => {
        try {
            return /^Spotify:track:\w{22}$/i.test(uri);
        }
        catch (e) {
            return false;
        }
    },
    name: (name) => {
        try {
            return /^\w{3,15}$/.test(name);
        }
        catch (e) {
            return false;
        }
    },
};

io.on('connection', async (socket) => {
    let discard = false;

    let access_token = await new Promise((resolve, reject) => dynamo.getItem(
        {
            TableName: 'states',
            Key: {
                stateCode: {
                    S: socket.handshake.query.state,
                },
            },
        },
        (err, data) => {
            if (err || !data.Item || data.Item.stateCode.S !== socket.handshake.query.state ||
                !data.Item.access_token || !data.Item.access_token.S) {
                reject(err);
            }
            else {
                resolve(data.Item.access_token.S);
            }
        }
    ))
        .catch(() => {
            socket.emit('err', { code: 0, type: 'invalid querystring value' });
            discard = true;
        });

    if (access_token) {
        const isPremium = await spotifyController.isPremium(access_token);

        if (!isPremium) {
            socket.emit('err', { type: 'You don\'t seem to have Spotify premium subscribtion, which is required in order to use this application.' });
            discard = true;

            dynamo.deleteItem({
                Key: {
                    stateCode: {
                        S: socket.handshake.query.state,
                    },
                },
                TableName: 'states',
            }, (err) => console.log(err));
        }
    }

    if (discard) {
        socket.disconnect();

        return;
    }

    const userId = await spotifyController.getUserId(access_token);

    if (clients.map((client) => client.id).includes(userId)) {
        socket.emit('err', { type: 'Only one tab per spotify account allowed.' });
        socket.disconnect();

        return;
    }

    socket.emit('receiveAccessToken', access_token);

    socket.on('sendDeviceId', ({ device_id }) => {
        socket.on('disconnect', () => {
            const droppedClient = clients[clients.map((client) => client.device_id).indexOf(device_id)];

            if (droppedClient) {
                const location = locateDeviceRoom(droppedClient.device_id);

                clearInterval(droppedClient.refreshInterval);
                if (location) {
                    leaveRoom(location);
                }

                clients.splice(clients.indexOf(droppedClient), 1);
            }

            dynamo.deleteItem({
                Key: {
                    stateCode: {
                        S: socket.handshake.query.state,
                    },
                },
                TableName: 'states',
            }, (err) => console.log(err));
        });

        clients.push(
            {
                access_token,
                device_id,
                socket,
                nick: 'Anonymous',
                id: userId,
                refreshInterval: setInterval(async () => {
                    await new Promise((resolve, reject) => lambda.invoke(
                        {
                            FunctionName: 'aws-nodejs-ecma-script-dev-refreshToken',
                            InvocationType: 'RequestResponse',
                            Payload: JSON.stringify({ state: socket.handshake.query.state }),
                        }, (err) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        })
                    );

                    access_token = await new Promise((resolve, reject) => dynamo.getItem(
                        {
                            TableName: 'states',
                            Key: {
                                stateCode: {
                                    S: socket.handshake.query.state,
                                },
                            },
                        },
                        (err, data) => {
                            if (err || !data.Item || data.Item.stateCode.S !== socket.handshake.query.state) {
                                reject(err);
                            }
                            else {
                                resolve(data.Item.access_token.S);
                            }
                        }
                    ))
                        .catch((err) => {
                            console.log(err);
                        });
                    verifyDeviceClient(device_id, clients).access_token = access_token;
                    socket.emit('updateAccessToken', access_token);
                }, 3300000),
            }
        );

        updateLobby(socket);

        socket.on('playTrack', (data) => {
            const location = locateDeviceRoom(device_id);
            const isValid = validate.trackUri(data.trackUri);

            if (location) {
                rooms[location.roomNumber].paused = false;
                if (data.unpause) {
                    for ({ socket } of rooms[location.roomNumber].clients) {
                        socket.emit('resume');
                    }
                }
                else if (isValid) {
                    for ({ socket } of rooms[location.roomNumber].clients) {
                        socket.emit('playTrack', data.trackUri);
                    }
                    if (data.trackUri !== rooms[location.roomNumber].currentlyPlaying) {
                        rooms[location.roomNumber].currentlyPlaying = data.trackUri;
                    }
                }
            }
        });

        socket.on('pauseTrack', () => {
            const location = locateDeviceRoom(device_id);

            if (location) {
                rooms[location.roomNumber].paused = true;
                for ({ socket } of rooms[location.roomNumber].clients) {
                    socket.emit('pause');
                }
            }
        });

        socket.on('movePlayback', ({ time }) => {
            const location = locateDeviceRoom(device_id);

            if (location) {
                for ({ socket } of rooms[location.roomNumber].clients) {
                    socket.emit('seek', time);
                }
            }
        });

        socket.on('joinRoom', ({ roomId, password }) => {
            const location = locateDeviceRoom(device_id);
            const client = verifyDeviceClient(device_id, clients);
            const roomNumber = rooms.map((room) => room.id).indexOf(roomId);

            if (!rooms[roomNumber]) {
                socket.emit('err', { type: 'invalid room' });

                return;
            }
            else if (rooms[roomNumber].password && rooms[roomNumber].password !== password) {
                socket.emit('err', { type: 'invalid password' });

                return;
            }
            else if (!client) {
                socket.emit('err', { type: 'invalid client' });

                return;
            }
            else if (location) {
                if (location.roomNumber === roomNumber) {
                    socket.emit('err', { type: 'You are already in the desired room.' });

                    return;
                }
                leaveRoom(location);
            }

            rooms[roomNumber].clients.push(client);
            updateLobby();
            updateRoom(roomNumber);

            if (rooms[roomNumber].currentlyPlaying) {
                socket.emit('playTrack', rooms[roomNumber].currentlyPlaying);
                socket.on('readyToSeek', () => {
                    spotifyController.getInfo(rooms[roomNumber].clients[0].access_token)
                        .then(({ progress_ms }) => {
                            socket.emit('seek', progress_ms);
                            if (rooms[roomNumber].paused) {
                                socket.emit('pause');
                            }
                        })
                        .catch((e) => console.log(e));
                    socket.removeAllListeners('readyToSeek');
                });
            }
        });
        socket.on('createRoom', ({ password, roomName }) => {
            if (!validate.name(roomName)) {
                socket.emit('err', { type: 'A room name must be between 3 and 15 characters long and must contain only aplha-numerical characters!' });

                return;
            }
            if (!validate.name(password) && password.length !== 0) {
                socket.emit('err', { type: 'A password must be between 3 and 15 characters long and must contain only aplha-numerical characters!' });

                return;
            }

            const client = verifyDeviceClient(device_id, clients);
            const location = locateDeviceRoom(device_id);

            if (!client) {
                socket.emit('err', { type: 'invalid client' });

                return null;
            }
            else if (location) {
                leaveRoom(location);
            }
            const hash = crypto.createHash('sha256');

            hash.update(`${new Date().getTime()}${rooms.length}`);
            rooms.push({
                clients: [client],
                playlist: [],
                paused: true,
                currentlyPlaying: '',
                password,
                roomName,
                id: hash.digest('hex'),
                messagesSent: 0,
            });
            updateRoom(rooms.length - 1);
            updateLobby();
        });

        socket.on('deleteRoom', () => {
            const location = locateDeviceRoom(device_id);

            if (!location) {
                socket.emit('err', { type: 'You must be in a room in order to delete it!' });
            }
            else if (location.deviceOffset !== 0) {
                socket.emit('err', { type: 'You must be the admin of a room in order to delete it!' });
            }
            else {
                updateDeleted(rooms.splice(location.roomNumber, 1)[0].clients);
                updateLobby();
            }
        });
        socket.on('leaveRoom', () => {
            const location = locateDeviceRoom(device_id);

            if (location) {
                leaveRoom(location);
            }
        });
        socket.on('addToPlaylist', async ({ trackUri }) => {
            const location = locateDeviceRoom(device_id);

            if (location) {
                if (rooms[location.roomNumber].playlist.map((track) => track.trackInfo.uri).includes(trackUri)) {
                    socket.emit('err', { type: 'This room\'s playlist already contains the desired track.' });
                }
                else if (validate.trackUri(trackUri)) {
                    try {
                        const trackInfo = await spotifyController.getTrackInfo(trackUri, access_token);

                        rooms[location.roomNumber].playlist.push({ trackInfo });
                        updateRoom(location.roomNumber);
                    }
                    catch (e) {
                        if (Number(e.error.status) === 400) {
                            socket.emit('err', { type: 'Invalid track uri.' });
                        }
                    }
                }
                else {
                    socket.emit('err', { type: 'Invalid uri syntax.' });
                }
            }
        });
        socket.on('removeFromPlaylist', ({ trackUri }) => {
            const location = locateDeviceRoom(device_id);

            if (location && trackUri) {
                const trackPos = rooms[location.roomNumber].playlist.map((track) => track.trackInfo.uri).indexOf(trackUri);

                if (trackUri === rooms[location.roomNumber].currentlyPlaying) {
                    for ({ socket } of rooms[location.roomNumber].clients) {
                        socket.emit('stopPlayback', null);
                    }
                    rooms[location.roomNumber].paused = true;
                    rooms[location.roomNumber].currentlyPlaying = '';
                }

                rooms[location.roomNumber].playlist.splice(trackPos, 1);
                updateRoom(location.roomNumber);
            }
        });
        socket.on('sendChatMessage', (content) => {
            const location = locateDeviceRoom(device_id);
            const sender = verifyDeviceClient(device_id, clients);
            const message = validate.chatMessage(content);

            if (location) {
                if (message) {
                    rooms[location.roomNumber].messagesSent++;
                    for (const client of rooms[location.roomNumber].clients) {
                        client.socket.emit('receiveChatMessage', {
                            content: message[1],
                            sender: {
                                nick: sender.nick,
                                id: sender.id,
                            },
                            key: rooms[location.roomNumber].messagesSent,
                        });
                    }
                }
                else {
                    socket.emit('err', { type: 'A chat message must be between 1 and 250 characters long.' });
                }
            }
        });
        socket.on('changeNick', ({ nick }) => {
            const client = verifyDeviceClient(device_id, clients);
            const location = locateDeviceRoom(device_id);

            if (client) {
                if (validate.name(nick)) {
                    client.nick = nick;
                    socket.emit('nickChanged', { nick });

                    if (location) {
                        updateRoom(location.roomNumber);
                    }
                }
                else {
                    socket.emit('err', { type: 'A nickname must be between 3 and 15 characters long and must contain only alpha-numerical characters.' });
                }
            }
        });

        socket.on('kickClient', (clientId) => {
            const adminLocation = locateDeviceRoom(device_id);
            const kickedLocation = locateDeviceRoom(clients[clients.map((client) => client.id).indexOf(clientId)].device_id);

            if (adminLocation && kickedLocation && adminLocation.roomNumber === kickedLocation.roomNumber && adminLocation.deviceOffset === 0) {
                if (kickedLocation.deviceOffset === 0) {
                    socket.emit('err', { type: 'You cannot kick yourself!' });

                    return;
                }

                updateDeleted(rooms[adminLocation.roomNumber].clients.splice(kickedLocation.deviceOffset, 1));
                updateRoom(adminLocation.roomNumber);
                updateLobby();
            }
        });
    });
});

server.listen(config.port);

const leaveRoom = (leaverLocation) => {
    const client = rooms[leaverLocation.roomNumber].clients.splice(leaverLocation.deviceOffset, 1);

    updateDeleted(client);

    if (leaverLocation.deviceOffset === 0 && rooms[leaverLocation.roomNumber].clients.length === 0) {
        updateDeleted(rooms[leaverLocation.roomNumber].clients);
        rooms.splice(leaverLocation.roomNumber, 1);
    }
    else {
        updateRoom(leaverLocation.roomNumber);
    }
    updateLobby();
};

const updateLobby = (socket) => {
    const roomsUpdate = rooms.map((room) => ({
        name: room.roomName,
        passRequired: room.password !== '',
        clientCount: room.clients.length,
        id: room.id,
    }));

    if (socket) {
        socket.emit('receiveLobbyUpdate', roomsUpdate);
    }
    else {
        io.emit('receiveLobbyUpdate', roomsUpdate);
    }
};

const updateRoom = (roomNumber) => {
    const clients = rooms[roomNumber].clients.map((client) => ({ nick: client.nick, id: client.id }));

    for (let i = 0; i < rooms[roomNumber].clients.length; i++) {
        rooms[roomNumber].clients[i].socket.emit('receiveRoomUpdate', {
            currentlyPlaying: rooms[roomNumber].currentlyPlaying,
            name: rooms[roomNumber].roomName,
            playlist: rooms[roomNumber].playlist,
            clients,
            isAdmin: i === 0,
            passwordRequired: rooms[roomNumber].password !== '',
        });
    }
};

const updateDeleted = (clients) => {
    for (const { socket } of clients) {
        socket.emit('stopPlayback');
        socket.emit('receiveRoomUpdate', { deleted: true });
    }
};

const verifyDeviceClient = (deviceID, clients) => {
    for (const client of clients) {
        if (deviceID === client.device_id) {
            return client;
        }
    }
};
const locateDeviceRoom = (deviceID) => {
    for (let i = 0; i < rooms.length; i++) {
        for (let j = 0; j < rooms[i].clients.length; j++) {
            if (rooms[i].clients[j].device_id === deviceID) {
                return { roomNumber: i, deviceOffset: j };
            }
        }
    }
};
