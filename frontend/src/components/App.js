import React from 'react';
import Room from '../containers/room';
import PasswordInput from '../containers/PasswordInput';
import NewRoomInput from '../containers/NewRoomInput';
import CssBaseline from '@material-ui/core/CssBaseline';
import Lobby from '../containers/lobby';
import ControlBar from '../containers/ControlBar';
import { withStyles } from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';
import ErrorPopup from '../containers/ErrorPopup';
import HelpDialog from '../containers/HelpDialog';

const styles = (theme) => ({
    layoutWrapper: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative',
        minWidth: 360,
        minHeight: 660,
        overflowX: 'hidden',
        backgroundColor: theme.palette.background.default,
    },
    '@media (max-width: 959px)': {
        layoutWrapper: {
            minHeight: 600,
        },
    },
    '@media (max-width: 599px)': {
        layoutWrapper: {
            minHeight: 560,
        },
    },
});

export default withWidth()(withStyles(styles)(
    ({ classes, width }) => (
        <React.Fragment>
            <CssBaseline />
            <div>
                <ErrorPopup />
                {width !== 'xs' && width !== 'sm' && <Lobby opened />}
                <div className={classes.layoutWrapper}>
                    <ControlBar />
                    <Room />
                </div>
                <PasswordInput />
                <NewRoomInput />
                <HelpDialog />
            </div>
        </React.Fragment>
    )
));
