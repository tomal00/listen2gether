import RoomSelection from '../../components/lobby';
import { connect } from 'react-redux';
import { showPaswordConf, showNewRoomInput, closeLobby } from '../../actions';
import { requestJoinRoom } from '../../requestActions';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    lobby = state.get('lobby'),
    nick = state.get('nick'),
) => ({
    rooms: lobby.get('rooms'),
    opened: lobby.get('opened'),
    nick: nick.get('nick'),
});

const dispatchToProps = (dispatch) => ({
    dispatchers: {
        handleCreateRoom: () => dispatch(showNewRoomInput()),
        handleRequestJoinRoom: (roomId) => dispatch(showPaswordConf(roomId)),
        handleCloseLobby: () => dispatch(closeLobby()),
        joinRoom: (roomId) => dispatch(requestJoinRoom(roomId)),
    },
});

export default connect(mapStateToProps, dispatchToProps)(toJS(RoomSelection));
