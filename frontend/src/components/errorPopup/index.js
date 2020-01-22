import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import Tooltip from '@material-ui/core/Tooltip';

const ErrorPopup = ({ handleClose, handleExit, open, message, classes }) => (
    <Snackbar
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        open={open}
        autoHideDuration={7000}
        onClose={handleClose}
        onExited={handleExit} >
        <SnackbarContent
            classes={
                {
                    root: classes.root,
                    message: classes.snackbarMessage,
                }
            }
            message={
                <React.Fragment>
                    <span className={classes.message}>
                        <Icon
                            classes={{ root: classes.icon }}>
                            error
                        </Icon>
                        {message}
                    </span>
                    <Tooltip
                        disableFocusListener
                        disableTouchListener
                        key={'close'}
                        title={'close'}>
                        <IconButton
                            onClick={handleClose}
                            classes={{ root: classes.closeButton }}>
                            <Icon
                                classes={{ root: classes.closeIcon }}>
                                close
                            </Icon>
                        </IconButton>
                    </Tooltip>
                </React.Fragment>
            } />
    </Snackbar>
);

ErrorPopup.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleExit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorPopup);
