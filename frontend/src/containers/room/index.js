import RoomComponent from '../../components/room';
import { connect } from 'react-redux';
import { renderChat, showError } from '../../actions';
import { requestDeleteRoom, requestLeaveRoom } from '../../requestActions';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    room = state.get('room'),
    lobby = state.get('lobby')
) => ({
    passwordRequired: room.get('passwordRequired'),
    lobbyOpened: lobby.get('opened'),
    renderChat: room.get('renderChat'),
    name: room.get('name'),
});

const dispatchToProps = (dispatch) => ({
    handleSocialSwap: (e, val) => dispatch(renderChat(val)),
    showError: (msg) => dispatch(showError(msg)),
    leaveRoom: () => dispatch(requestLeaveRoom()),
    deleteRoom: () => dispatch(requestDeleteRoom()),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(RoomComponent));
