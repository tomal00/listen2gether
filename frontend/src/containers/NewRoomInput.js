import NewRoominput from '../components/NewRoominput';
import { connect } from 'react-redux';
import { hideNewRoomInput, showError } from '../actions';
import { requestCreateRoom } from '../requestActions';
import toJS from '../to-js';

const dispatchToProps = (dispatch) => ({
    hide: () => dispatch(hideNewRoomInput()),
    showError: (msg) => dispatch(showError(msg)),
    createRoom: (roomName, password) => dispatch(requestCreateRoom(roomName, password)),
});
const mapStateToProps = (
    state,
    newRoomInput = state.get('newRoomInput'),
) => ({
    active: newRoomInput.get('active'),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(NewRoominput));
