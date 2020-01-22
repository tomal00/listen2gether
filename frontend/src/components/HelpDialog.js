import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    list: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
    },
});

const HelpDialog = ({ handleHide, active, classes }) => (
    <Dialog
        open={active}
        onBackdropClick={handleHide} >
        <DialogTitle>{'How to use:'}</DialogTitle>
        <DialogContent>
            <ul className={classes.list}>
                <li>
                    <DialogContentText>{'1) Create a room'}</DialogContentText>
                </li>
                <li>
                    <DialogContentText>{'2) Click on the "Add new track" button'}</DialogContentText>
                </li>
                <li>
                    <DialogContentText>{'3) Enter the name of the song and click search'}</DialogContentText>
                </li>
                <li>
                    <DialogContentText>{'4) Add the desired song by clicking the "Add to playlist button"'}</DialogContentText>
                </li>
                <li>
                    <DialogContentText>{'5) Click the song\'s preview image to start the playback'}</DialogContentText>
                </li>
            </ul>
        </DialogContent>
        <DialogTitle>{'About'}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {`This web application let's you synchronize music streamed from Spotify with other people.
            In order to use the web application, you need to have a spotify premium subscribtion, because 
            Spotify only allows premium users to use it's `}
                <a href='https://developer.spotify.com/documentation/web-playback-sdk'>{'Web Player'}</a>
                {'.'}
            </DialogContentText>
        </DialogContent>
    </Dialog>
);

HelpDialog.propTypes = {
    handleHide: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
};

export default withStyles(styles)(HelpDialog);
