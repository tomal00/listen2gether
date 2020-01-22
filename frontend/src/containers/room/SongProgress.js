import SongProgress from '../../components/room/songProgress';
import { receiveSongTimeUpdate, tick } from '../../actions';
import { connect } from 'react-redux';
import { requestMovePlayback } from '../../requestActions';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    songProgress = state.get('songProgress'),
    spotifyPlayer = state.get('spotifyPlayer'),
    playlist = state.get('playlist')
) => ({
    currentTime: songProgress.get('currentTime'),
    maxTime: songProgress.get('maxTime'),
    allowUpdates: songProgress.get('allowUpdates'),
    paused: songProgress.get('paused'),
    spotifyPlayer: spotifyPlayer.get('spotifyPlayer'),
    currentlyPlaying: playlist.get('currentlyPlaying'),
});
const dispatchToProps = (dispatch) => ({
    moveTime: (time) => dispatch(receiveSongTimeUpdate(time)),
    tick: () => dispatch(tick()),
    movePlayback: (time) => dispatch(requestMovePlayback(time)),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(SongProgress));

