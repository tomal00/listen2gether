import Controls from '../../components/room/controls';
import { requestPlayTrack, requestUnpause, requestPause } from '../../requestActions';
import { connect } from 'react-redux';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    songProgress = state.get('songProgress'),
    playlist = state.get('playlist')
) => ({
    paused: songProgress.get('paused'),
    currentlyPlaying: playlist.get('currentlyPlaying'),
    playlist: playlist.get('playlist'),
});
const dispatchToProps = (dispatch) => ({
    playTrack: (trackUri) => dispatch(requestPlayTrack(trackUri)),
    unpause: () => dispatch(requestUnpause()),
    pause: () => dispatch(requestPause()),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(Controls));

