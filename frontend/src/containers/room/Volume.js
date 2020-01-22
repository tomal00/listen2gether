import Volume from '../../components/room/controls/volume';
import { mute, setVolume } from '../../actions';
import { connect } from 'react-redux';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    volume = state.get('volume'),
) => ({
    muted: volume.get('muted'),
    volume: volume.get('volume'),
});
const dispatchToProps = (dispatch) => ({
    setVolume: (volume) => dispatch(setVolume(volume)),
    mute: () => dispatch(mute()),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(Volume));

