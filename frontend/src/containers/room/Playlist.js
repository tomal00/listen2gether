import Playlist from '../../components/room/playlist';
import { connect } from 'react-redux';
import { showAddTrackDialog } from '../../actions';
import { requestPlayTrack, requestPlaylistRemoval } from '../../requestActions';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    playlist = state.get('playlist'),
) => ({
    currentlyPlaying: playlist.get('currentlyPlaying'),
    playlist: playlist.get('playlist'),
});

const dispatchToProps = (dispatch) => ({
    showAddTrackDialog: () => dispatch(showAddTrackDialog()),
    playTrack: (trackUri) => dispatch(requestPlayTrack(trackUri)),
    removeFromPlaylist: (trackUri) => dispatch(requestPlaylistRemoval(trackUri)),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(Playlist));

