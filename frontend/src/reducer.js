import { combineReducers } from 'redux-immutable';
import * as actions from './actions';
import { Record, fromJS, List } from 'immutable';

const ErrorPopupInitialState = new Record({ message: '', open: false });

const errorPopup = (state = new ErrorPopupInitialState(), action) => {
    switch (action.type) {
        case actions.SHOW_ERROR:
            return state.merge({ open: true, message: action.message });
        case actions.HIDE_ERROR:
            return state.set('open', false);
        case actions.CLEAR_ERROR_MESSAGE:
            return state.set('message', '');
        default:
            return state;
    }
};

const LobbyInitialState = new Record({
    rooms: new List(),
    opened: true,
});

const lobby = (state = new LobbyInitialState(), action) => {
    switch (action.type) {
        case actions.RECEIVE_LOBBY_UPDATE:
            return state.set('rooms', fromJS(action.rooms));
        case actions.OPEN_LOBBY:
            return state.set('opened', true);
        case actions.CLOSE_LOBBY:
            return state.set('opened', false);
        default:
            return state;
    }
};

const RoomInitialState = new Record({
    passwordRequired: false,
    renderChat: 1,
    name: '',
});

const room = (state = new RoomInitialState(), action) => {
    switch (action.type) {
        case actions.RECEIVE_ROOM_UPDATE:
            return state.merge({
                passwordRequired: action.passwordRequired,
                name: action.name,
            });
        case actions.DELETE_ROOM:
            return new RoomInitialState();
        case actions.RENDER_CHAT:
            return state.set('renderChat', action.val);
        default:
            return state;
    }
};

const VolumeInitialState = new Record({
    muted: false,
    volume: 50,
});

const volume = (state = new VolumeInitialState(), action) => {
    switch (action.type) {
        case actions.SET_VOLUME:
            return state.merge({ volume: action.volume, muted: false });
        case actions.MUTE:
            return state.set('muted', true);
        default:
            return state;
    }
};

const ChatInitialState = new Record({
    messages: new List(),
});

const chat = (state = new ChatInitialState(), action) => {
    switch (action.type) {
        case actions.RECEIVE_CHAT_MESSAGE:
            if (state.get('messages').count() > 39) {
                return state.set(
                    'messages',
                    state.get('messages').insert(fromJS(action.message), 0)
                        .pop(),
                );
            }

            return state.set(
                'messages',
                state.get('messages').insert(0, action.message)
            );
        case actions.DELETE_ROOM:
            return new ChatInitialState();
        default:
            return state;
    }
};

const GuestListIntialState = new Record({
    clients: new List(),
    isAdmin: false,
});

const guestList = (state = new GuestListIntialState(), action) => {
    switch (action.type) {
        case actions.RECEIVE_ROOM_UPDATE:
            return new GuestListIntialState({
                clients: fromJS(action.clients),
                isAdmin: action.isAdmin,
            });
        case actions.DELETE_ROOM:
            return new GuestListIntialState();
        default:
            return state;
    }
};

const PlaylistInitialState = new Record({
    currentlyPlaying: '',
    playlist: new List(),
});

const playlist = (state = new PlaylistInitialState(), action) => {
    switch (action.type) {
        case actions.RECEIVE_ROOM_UPDATE:
            return new PlaylistInitialState({
                currentlyPlaying: action.currentlyPlaying,
                playlist: fromJS(action.playlist),
            });
        case actions.DELETE_ROOM:
            return new PlaylistInitialState();
        case actions.PLAY_TRACK:
            return state.set('currentlyPlaying', action.trackUri);
        default:
            return state;
    }
};

const PasswordInputInitialState = new Record({
    active: false,
    roomId: null,
});

const passwordInput = (state = new PasswordInputInitialState(), action) => {
    switch (action.type) {
        case actions.SHOW_PASSWORD_CONF:
            return new PasswordInputInitialState({
                active: true,
                roomId: action.roomId,
            });
        case actions.HIDE_PASSWORD_CONF:
            return new PasswordInputInitialState();
        default:
            return state;
    }
};

const SongProgressInitialState = new Record({
    currentTime: 0,
    maxTime: 0,
    allowUpdates: false,
    paused: true,
});

const songProgress = (state = new SongProgressInitialState(), action) => {
    switch (action.type) {
        case actions.SET_SONG_MAX_TIME:
            return state.set('maxTime', action.songTime);
        case actions.RECEIVE_SONG_TIME_UPDATE:
            return state.set('currentTime', action.newTime);
        case actions.TICK: {
            return state.set('currentTime', state.currentTime + 1000);
        }
        case actions.PAUSE_PLAYBACK:
            return state.merge({ allowUpdates: false, paused: true });
        case actions.PLAY_PLAYBACK:
            return state.merge({ currentTime: 0, allowUpdates: false, paused: false });
        case actions.RESUME_PLAYBACK:
            return state.merge({ allowUpdates: true, paused: false });
        case actions.DELETE_ROOM:
            return new SongProgressInitialState();
        default:
            return state;
    }
};

const NewRoominputInitialState = new Record({
    active: false,
});

const newRoomInput = (state = new NewRoominputInitialState(), action) => {
    switch (action.type) {
        case actions.SHOW_NEW_ROOM_INPUT:
            return state.set('active', true);
        case actions.HIDE_NEW_ROOM_INPUT:
            return state.set('active', false);
        default:
            return state;
    }
};

const HelpDialogInitialState = new Record({
    active: false,
});

const helpDialog = (state = new HelpDialogInitialState(), action) => {
    switch (action.type) {
        case actions.SHOW_HELP:
            return state.set('active', true);
        case actions.HIDE_HELP:
            return state.set('active', false);
        default:
            return state;
    }
};

const AddTrackDialogInitialState = new Record({
    active: false,
});

const addTrackDialog = (state = new AddTrackDialogInitialState(), action) => {
    switch (action.type) {
        case actions.SHOW_ADD_TRACK_DIALOG:
            return state.set('active', true);
        case actions.HIDE_ADD_TRACK_DIALOG:
            return state.set('active', false);
        default:
            return state;
    }
};
const QueryListInitialState = new Record({
    tracks: new List(),
    fetched: false,
});

const queryList = (state = new QueryListInitialState(), action) => {
    switch (action.type) {
        case actions.EXIT_ADD_TRACK_DIALOG:
            return new QueryListInitialState();
        case actions.RECEIVE_RESULTS:
            return state.merge({ tracks: fromJS(action.results), fetched: true });
        default:
            return state;
    }
};

const NickInitialState = new Record({
    nick: 'Anonymous',
});

const nick = (state = new NickInitialState(), action) => {
    switch (action.type) {
        case actions.CHANGE_NICK:
            return state.set('nick', action.nick);
        default:
            return state;
    }
};

const SpotifyPlayerInitialState = new Record({
    spotifyPlayer: null,
});

const spotifyPlayer = (state = new SpotifyPlayerInitialState(), action) => {
    switch (action.type) {
        case actions.ADD_PLAYER:
            return state.set('spotifyPlayer', action.player);
        default:
            return state;
    }
};

const access_token = (state = '', action) => {
    switch (action.type) {
        case actions.SET_ACCESS_TOKEN:
            return action.access_token;
        case actions.CHANGE_ACCESS_TOKEN:
            return action.access_token;
        default:
            return state;
    }
};

export default combineReducers({
    songProgress,
    newRoomInput,
    nick,
    room,
    lobby,
    errorPopup,
    passwordInput,
    spotifyPlayer,
    chat,
    guestList,
    playlist,
    volume,
    helpDialog,
    addTrackDialog,
    queryList,
    access_token,
});
