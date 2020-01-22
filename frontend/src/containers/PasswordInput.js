import PasswordInput from '../components/PasswordInput';
import { connect } from 'react-redux';
import { hidePasswordConf } from '../actions';
import { requestJoinRoom } from '../requestActions';
import toJS from '../to-js';

const dispatchToProps = (dispatch) => ({
    hide: () => dispatch(hidePasswordConf()),
    joinRoom: (roomId, password) => dispatch(requestJoinRoom(roomId, password)),
});
const mapStateToProps = (
    state,
    passwordInput = state.get('passwordInput'),
) => ({
    active: passwordInput.get('active'),
    roomId: passwordInput.get('roomId'),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(PasswordInput));
