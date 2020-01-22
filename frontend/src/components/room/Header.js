import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';

const Header = ({ width, classes, handleLeavingRoom, handleRoomDeletion, name }) => {
    const leaveRoom = (
        <Button
            color='primary'
            variant='outlined'
            onClick={handleLeavingRoom}>
            <Icon>meeting_room</Icon>
            {'LEAVE ROOM'}
        </Button>
    );
    const deleteRoom = (
        <Button
            color='primary'
            variant='outlined'
            onClick={handleRoomDeletion}>
            {'DELETE ROOM'}
            <Icon>no_meeting_room</Icon>
        </Button>
    );
    const nameText = (
        <Typography
            title={name}
            variant='display2'
            classes={{ root: classes.truncatedText }}>
            {name}
        </Typography>
    );

    if (width === 'xs' || width === 'sm') {
        return (

            <div className={classes.roomHeader}>
                <Paper
                    classes={{ root: classes.headerPaper }}>
                    {nameText}
                </Paper>
                {leaveRoom}
                {deleteRoom}
            </div>

        );
    }

    return (
        <Paper
            classes={{ root: classes.headerPaper }}>
            <div className={classes.roomHeader}>
                {leaveRoom}
                {nameText}
                {name && deleteRoom}
            </div>
        </Paper>
    );
};

Header.propTypes = {
    width: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    handleLeavingRoom: PropTypes.func.isRequired,
    handleRoomDeletion: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
};

export default Header;
