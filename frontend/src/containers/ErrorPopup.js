import ErrorPopupComponent from '../components/errorPopup';
import { connect } from 'react-redux';
import { hideError, clearErrorMessage } from '../actions';
import toJS from '../to-js';

const mapStateToProps = (
    state,
    errorPopup = state.get('errorPopup')
) => ({
    open: errorPopup.get('open'),
    message: errorPopup.get('message'),
});

const dispatchToProps = (dispatch) => ({
    handleClose: (e, reason) => reason === 'clickaway' ? null : dispatch(hideError()),
    handleExit: () => dispatch(clearErrorMessage()),
});

export default connect(mapStateToProps, dispatchToProps)(toJS(ErrorPopupComponent));

