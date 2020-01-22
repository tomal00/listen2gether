import Chat from '../../components/room/chat';
import { connect } from 'react-redux';
import { showError } from '../../actions';
import { sendChatMessage } from '../../requestActions';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    chat = state.get('chat'),
) => ({
    messages: chat.get('messages'),
});
const dispatchToProps = (dispatch) => ({
    showError: (msg) => dispatch(showError(msg)),
    sendChatMessage: (msg) => dispatch(sendChatMessage(msg)),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(Chat));

