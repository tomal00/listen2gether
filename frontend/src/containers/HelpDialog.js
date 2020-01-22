import HelpDialog from '../components/HelpDialog';
import { connect } from 'react-redux';
import { hideHelp } from '../actions';
import toJS from '../to-js';

const dispatchToProps = (dispatch) => ({
    handleHide: () => dispatch(hideHelp()),
});
const mapStateToProps = (
    state,
    helpDialog = state.get('helpDialog')
) => ({
    active: helpDialog.get('active'),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(HelpDialog));
