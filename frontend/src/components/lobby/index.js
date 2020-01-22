import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import styles from './styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.handleJoinRoom = this.handleJoinRoom.bind(this);
    }

    handleJoinRoom(roomId, passRequired) {
        if (passRequired) {
            this.props.dispatchers.handleRequestJoinRoom(roomId);
        }
        else {
            this.props.joinRoom(roomId);
        }
    }

    render() {
        const { rooms, opened, dispatchers, classes, width } = this.props;
        const drawerVariant = width === 'xl' ? 'persistent' : 'temporary';
        const drawerOnClose = width === 'lg' || width === 'md' ? dispatchers.handleCloseLobby : null;
        const topSpace = width === 'lg' || width === 'md' ? null : (<div className={classes.toolbar} />);
        const Wrapper = width === 'lg' || width === 'md' ? Toolbar : 'div';
        const RoomList = (
            <ul className={classes.rooms}>
                {rooms.map((room) => (
                    <li key={room.id} className={classes.row}>
                        {room.passRequired && (<Icon classes={{ root: classes.lockIcon }}>{'lock'}</Icon>)}
                        <Typography
                            variant={'subheading'}
                            classes={{ root: `${classes.roomName} ${classes.truncatedText}` }}
                            title={`${room.name} (${room.clientCount})`}>
                            {`${room.name} (${room.clientCount})`}
                        </Typography>
                        <Button
                            variant='raised'
                            classes={{ root: classes.join }}
                            color='secondary'
                            onClick={() => this.handleJoinRoom(room.id, room.passRequired)}>
                            {'JOIN'}
                        </Button>
                    </li>
                ))}
            </ul>
        );

        if (width === 'xs' || width === 'sm') {
            return (
                <React.Fragment>
                    <Paper classes={{ root: classes.headerPaper }}>
                        <div className={classes.header}>
                            <div>
                                <Typography variant='title'>{'Rooms'}</Typography>
                            </div>
                            <Button onClick={dispatchers.handleCreateRoom}>
                                <Icon>{'add'}</Icon>
                                {'CREATE ROOM'}
                            </Button>
                        </div>
                    </Paper>
                    {RoomList}
                </React.Fragment>
            );
        }

        return (
            <div>
                <Drawer
                    anchor='left'
                    open={opened}
                    variant={drawerVariant}
                    onClose={drawerOnClose}
                    classes={{
                        paper: classes.paper,
                    }}>
                    {topSpace}
                    <AppBar position={'static'} color={'secondary'}>
                        <Wrapper>
                            <div className={classes.header}>
                                <div>
                                    <Typography variant='title'>{'Rooms'}</Typography>
                                </div>
                                <Button onClick={() => dispatchers.handleCreateRoom()}>
                                    <Icon>{'add'}</Icon>
                                    {'CREATE ROOM'}
                                </Button>
                            </div>
                        </Wrapper>
                    </AppBar>
                    {RoomList}
                </Drawer>
            </div>
        );
    }
}

Lobby.propTypes = {
    rooms: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        clientCount: PropTypes.number.isRequired,
        passRequired: PropTypes.bool.isRequired,
    })).isRequired,
    opened: PropTypes.bool.isRequired,
    dispatchers: PropTypes.exact({
        handleCreateRoom: PropTypes.func.isRequired,
        handleRequestJoinRoom: PropTypes.func.isRequired,
        handleCloseLobby: PropTypes.func.isRequired,
        joinRoom: PropTypes.func.isRequired,
    }).isRequired,
    classes: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
};

export default withWidth()(withStyles(styles)(Lobby));
