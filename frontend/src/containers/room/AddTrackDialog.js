import AddTrackDialog from '../../components/room/playlist/addTrackDialog';
import { connect } from 'react-redux';
import { showError, hideAddTrackDialog, exitAddTrackDialog } from '../../actions';
import { requestSongSearch, requestPlaylistAddition } from '../../requestActions';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    addTrackDialog = state.get('addTrackDialog'),
    access_token = state.get('access_token'),
) => ({
    active: addTrackDialog.get('active'),
    access_token,
});

const dispatchToProps = (dispatch) => ({
    showError: (msg) => dispatch(showError(msg)),
    hideAddTrackDialog: () => dispatch(hideAddTrackDialog()),
    exitAddTrackDialog: () => dispatch(exitAddTrackDialog()),
    requestQuery: (query, access_token) => dispatch(requestSongSearch(query, access_token)),
    addToPlaylist: (trackUri) => dispatch(requestPlaylistAddition(trackUri)),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(AddTrackDialog));

