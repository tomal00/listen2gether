import QueryList from '../../components/room/playlist/addTrackDialog/queryList';
import { connect } from 'react-redux';
import toJS from '../../to-js';

const mapStateToProps = (
    state,
    queryList = state.get('queryList'),
) => ({
    tracks: queryList.get('tracks'),
    fetched: queryList.get('fetched'),
});

export default connect(mapStateToProps)(toJS(QueryList));

