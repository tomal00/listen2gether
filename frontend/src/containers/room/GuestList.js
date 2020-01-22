import GuestList from '../../components/room/guestList';
import { connect } from 'react-redux';
import toJS from '../../to-js';
import { requestKickClient } from '../../requestActions';

const mapStateToProps = (
    state,
    guestList = state.get('guestList'),
) => ({
    clients: guestList.get('clients'),
    isAdmin: guestList.get('isAdmin'),
});

const mapDispatchToProps = (dispatch) => ({
    kickClient: (clientId) => dispatch(requestKickClient(clientId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(GuestList));

