import { take, put, call, takeEvery, takeLatest, apply, fork, select, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as actions from './actions';
import * as rActions from './requestActions';
import cfg from './cfg';

function createSocketChannel(socket) {
    return eventChannel((emit) => {
        socket.on('receiveLobbyUpdate', (rooms) => emit(actions.receiveLobbyUpdate(rooms)));
        socket.on('receiveChatMessage', (message) => emit(actions.receiveChatMessage(message)));
        socket.on('receiveRoomUpdate', (data) => {
            if (data.deleted) {
                emit(actions.deleteRoom());
            }
            else {
                emit(actions.receiveRoomUpdate(data));
            }
        });
        socket.on('nickChanged', ({ nick }) => emit(actions.changeNick(nick)));
        socket.on('updateAccessToken', (access_token) => emit(actions.changeAccessToken(access_token)));
        socket.on('receiveAccessToken', (access_token) => emit(actions.setAccessToken(access_token)));
        socket.on('playTrack', (trackUri) => emit(actions.playTrack(trackUri)));
        socket.on('stopPlayback', () => emit(actions.stopPlayback()));
        socket.on('pause', () => emit(actions.pausePlayback()));
        socket.on('resume', () => emit(actions.resumePlayback()));
        socket.on('seek', (time) => emit(actions.seek(time)));
        socket.on('err', ({ type, code }) => {
            if (code === 0) {
                window.location.href = cfg.authorize;
            }
            else {
                emit(actions.showError(type));
            }
        });

        return () => socket.off();
    });
}

function* socketListener(socket) {
    yield takeEvery(rActions.REQUEST_CHANGE_NICK, function* ({ newNick }) {
        yield apply(socket, socket.emit, ['changeNick', { nick: newNick }]);
    });
    yield takeEvery(rActions.SEND_CHAT_MESSAGE, function* ({ msg }) {
        yield apply(socket, socket.emit, ['sendChatMessage', msg]);
    });
    yield takeEvery(rActions.SEND_DEVICE_ID, function* ({ device_id }) {
        yield apply(socket, socket.emit, ['sendDeviceId', { device_id }]);
    });
    yield takeEvery(rActions.REQUEST_PLAY_TRACK, function* ({ trackUri }) {
        yield apply(socket, socket.emit, ['playTrack', { trackUri }]);
    });
    yield takeEvery(rActions.REQUEST_UNPAUSE, function* () {
        yield apply(socket, socket.emit, ['playTrack', { unpause: true }]);
    });
    yield takeEvery(rActions.REQUEST_PAUSE, function* () {
        yield apply(socket, socket.emit, ['pauseTrack']);
    });
    yield takeEvery(rActions.REQUEST_MOVE_PLAYBACK, function* ({ time }) {
        yield apply(socket, socket.emit, ['movePlayback', { time }]);
    });
    yield takeEvery(rActions.REQUEST_JOIN_ROOM, function* ({ roomId, password }) {
        yield apply(socket, socket.emit, ['joinRoom', { roomId, password }]);
    });
    yield takeEvery(rActions.ALLOW_SEEKING, function* () {
        yield apply(socket, socket.emit, ['readyToSeek']);
    });
    yield takeEvery(rActions.REQUEST_CREATE_ROOM, function* ({ roomName, password }) {
        yield apply(socket, socket.emit, ['createRoom', { roomName, password }]);
    });
    yield takeEvery(rActions.REQUEST_DELETE_ROOM, function* () {
        yield apply(socket, socket.emit, ['deleteRoom']);
    });
    yield takeEvery(rActions.REQUEST_LEAVE_ROOM, function* () {
        yield apply(socket, socket.emit, ['leaveRoom']);
    });
    yield takeEvery(rActions.REQUEST_TRACK_ADDITION, function* ({ trackUri }) {
        yield apply(socket, socket.emit, ['addToPlaylist', { trackUri }]);
    });
    yield takeEvery(rActions.REQUEST_TRACK_REMOVAL, function* ({ trackUri }) {
        yield apply(socket, socket.emit, ['removeFromPlaylist', { trackUri }]);
    });
    yield takeEvery(rActions.REQUEST_KICK_CLIENT, function* ({ clientId }) {
        yield apply(socket, socket.emit, ['kickClient', clientId]);
    });

    const socketChannel = yield call(createSocketChannel, socket);

    yield takeEvery(socketChannel, function* (ecAction) {
        yield put.resolve(ecAction);
    });
}

function addPlayerStateChangedListener(player, access_token, emit) {
    player.addListener('player_state_changed', (playerState) => {
        if (playerState) {
            const { position, paused, track_window } = playerState;

            if (position === 0) {
                if (playerState.disallows.pausing) {
                    emit(actions.finishPlayback());
                }
                else {
                    const headers = new Headers();

                    headers.append('Authorization', `Bearer ${access_token}`);
                    fetch(new Request(`https://api.spotify.com/v1/tracks/${track_window.current_track.id}`, { headers }))
                        .then((res) => res.json())
                        .then((data) => emit(actions.beginPlayback(data.duration_ms)))
                        .catch((e) => console.log(e));
                }
            }
            emit(actions.receiveSongTimeUpdate(position));

            if (!paused) {
                emit(actions.resumeTrack());
            }
            else if (paused) {
                emit(actions.pauseTrack());
            }
        }
        else {
            emit(actions.anullPlayback());
        }
    });
}
function setUpPlayerListeners(player, access_token, emit) {
    player.addListener('ready', ({ device_id }) => {
        addPlayerStateChangedListener(player, access_token, emit);
        emit(rActions.sendDeviceId(device_id));
    });
}
function createPlayerChannel(player, access_token, firstTime) {
    return eventChannel((emit) => {
        if (firstTime) {
            setUpPlayerListeners(player, access_token, emit);

            return () => {
                player.removeListener('ready');
                player.removeListener('player_state_changed');
            };
        }
        addPlayerStateChangedListener(player, access_token, emit);

        return () => player.removeListener('player_state_changed');
    });
}

function* playerListener() {
    let { access_token } = yield take(actions.SET_ACCESS_TOKEN);
    const player = new Spotify.Player({
        name: 'listen2gether',
        getOAuthToken: (cb) => cb(access_token),
        volume: 0.5,
    });

    yield put(actions.addPlayer(player));
    yield apply(player, player.connect);

    let playerChannel = yield call(createPlayerChannel, player, access_token, true);

    yield fork(function* () {
        const { device_id } = yield take(rActions.SEND_DEVICE_ID);

        yield takeEvery(actions.STOP_PLAYBACK, function* () {
            yield call(
                () => fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ uris: [] }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access_token}`,
                    },
                })
            );
        });

        yield takeLatest(actions.PLAY_TRACK, function* ({ trackUri }) {
            yield call(
                () => fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ uris: [trackUri] }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access_token}`,
                    },
                })
            );
        });
    });
    yield takeEvery(actions.PAUSE_PLAYBACK, function* () {
        yield apply(player, player.pause);
    });
    yield takeEvery(actions.RESUME_PLAYBACK, function* () {
        yield apply(player, player.resume);
    });
    yield takeEvery(actions.SEEK, function* ({ time }) {
        yield apply(player, player.seek, [time]);
    });
    yield takeEvery(actions.SET_VOLUME, function* ({ volume }) {
        yield apply(player, player.setVolume, [volume / 200]);
    });
    yield takeEvery(actions.MUTE, function* () {
        yield apply(player, player.setVolume, [0]);
    });
    yield takeEvery(actions.CHANGE_ACCESS_TOKEN, function* (action) {
        playerChannel.close();
        access_token = action.access_token;
        playerChannel = yield call(createPlayerChannel, player, access_token, false);

        yield takeEvery(playerChannel, function* (ecAction) {
            yield fork(handlePlayerAction, ecAction);
        });
    });

    yield takeEvery(playerChannel, function* (ecAction) {
        yield fork(handlePlayerAction, ecAction);
    });
}
function* handlePlayerAction(action) {
    if (action.type === actions.FINISH_PLAYBACK) {
        const guestList = yield select((state) => state.get('guestList').toJS());
        const playlist = yield select((state) => state.get('playlist').toJS());

        if (!guestList.isAdmin || playlist.playlist.length === 0) {
            return;
        }
        const uris = playlist.playlist.map((track) => track.trackInfo.uri);
        const currentUriIndex = uris.indexOf(playlist.currentlyPlaying);

        if (currentUriIndex + 1 < playlist.playlist.length) {
            yield put(rActions.requestPlayTrack(uris[currentUriIndex + 1]));
        }
        else {
            yield put(rActions.requestPlayTrack(uris[0]));
        }
    }
    switch (action.type) {
        case actions.BEGIN_PLAYBACK:
            yield put(actions.setSongMaxTime(action.maxTime));
            yield put(rActions.allowSeeking());
            break;
        case actions.RESUME_TRACK:
            yield put(actions.resumePlayback());
            yield put(actions.enableTimeCounter());
            break;
        case actions.PAUSE_TRACK:
            yield put(actions.pausePlayback());
            yield put(actions.disableTimeCounter());
            break;
        case actions.ANULL_PLAYBACK:
            yield put(actions.receiveSongTimeUpdate(0));
            yield put(actions.setSongMaxTime(0));
            break;
        default:
            yield put(action);
    }
}

function* songSearchListener() {
    yield takeEvery(rActions.REQUEST_SONG_SEARCH, function* ({ query, access_token }) {
        const { res, err } = yield call(
            () => fetch(encodeURI(`https://api.spotify.com/v1/search?type=track&q=${query}`), {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
                .then((response) => response.json())
                .then((json) => ({
                    res: json.tracks.items.map((track) => ({
                        uri: track.uri,
                        artist: track.artists.map((artist) => artist.name).join(', '),
                        name: track.name,
                        albumImgUri: track.album.images[2].url,
                    })),
                }))
                .catch((e) => ({ err: e }))
        );

        if (err) {
            yield put(actions.showError('An error occured while searching for the track.'));
        }
        else {
            yield put(actions.receiveResults(res));
        }
    });
}

export default function* rootSaga(socket) {
    yield all([
        socketListener(socket),
        playerListener(),
        songSearchListener(),
    ]);
}
