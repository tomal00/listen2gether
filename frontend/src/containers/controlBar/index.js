import controlBar from '../../components/controlBar';
import { connect } from 'react-redux';
import { openLobby, closeLobby, showError, showHelp } from '../../actions';
import { requestChangeNick } from '../../requestActions';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    lobby = state.get('lobby'),
    nick = state.get('nick'),
) => ({
    lobbyOpened: lobby.get('opened'),
    nick: nick.get('nick'),
});

const dispatchToProps = (dispatch) => ({
    openLobby: () => dispatch(openLobby()),
    closeLobby: () => dispatch(closeLobby()),
    showError: (msg) => dispatch(showError(msg)),
    showHelp: () => dispatch(showHelp()),
    changeNick: (nick) => dispatch(requestChangeNick(nick)),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(controlBar));
