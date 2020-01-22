import React from 'react';
import PropTypes from 'prop-types';
import Controls from '../../containers/room/Controls';
import Chat from '../../containers/room/Chat';
import GuestList from '../../containers/room/GuestList';
import Playlist from '../../containers/room/Playlist';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Lobby from '../../containers/lobby';
import MobileMenu from './MobileMenu';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import styles from './styles';
import Header from './Header';

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }

    leaveRoom() {
        this.props.leaveRoom();
    }

    deleteRoom() {
        this.props.deleteRoom();
    }
    render() {
        const props = this.props;

        if (props.width === 'xs' || props.width === 'sm') {
            return (
                <MobileMenu
                    disableRoomTabs={!props.name}>
                    <Lobby />
                    <div className={props.classes.playerWrapper}>
                        <div className={props.classes.playListWrapper}>
                            <Playlist />
                        </div>
                        <div className={props.classes.controlsWrapper} >
                            <Controls />
                        </div>
                    </div>
                    <GuestList />
                    <Chat />
                    <Header
                        classes={props.classes}
                        handleLeavingRoom={this.leaveRoom}
                        handleRoomDeletion={this.deleteRoom}
                        passwordRequired={props.passwordRequired}
                        name={props.name}
                        width={props.width} />
                </MobileMenu>
            );
        }
        else if (!props.name) {
            return null;
        }

        return (
            <div className={`${props.classes.roomWrapper} ${props.lobbyOpened && props.width === 'xl' ?
                props.classes.roomWrapperReduced : props.classes.roomWrapperFull}`}>
                <div className={props.classes.room}>
                    <Header
                        classes={props.classes}
                        handleLeavingRoom={this.leaveRoom}
                        handleRoomDeletion={this.deleteRoom}
                        passwordRequired={props.passwordRequired}
                        name={props.name}
                        width={props.width} />
                    <div className={props.classes.controlsWrapper} >
                        <Controls />
                    </div>
                    <div className={props.classes.playListWrapper}>
                        <Playlist />
                    </div>
                    <div className={props.classes.socialWrapper}>
                        <AppBar
                            position='static'
                            classes={{ root: 'socialSwitch' }}
                            color={'secondary'}>
                            <Tabs
                                value={props.renderChat}
                                indicatorColor={'primary'}
                                onChange={props.handleSocialSwap}
                                fullWidth >
                                <Tab
                                    value={0}
                                    label='Users' />
                                <Tab
                                    value={1}
                                    label='Chat' />
                            </Tabs>
                        </AppBar>
                        {props.renderChat ?
                            <Chat /> :
                            <GuestList />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Room.propTypes = {
    width: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    leaveRoom: PropTypes.func.isRequired,
    deleteRoom: PropTypes.func.isRequired,
    passwordRequired: PropTypes.bool.isRequired,
    lobbyOpened: PropTypes.bool.isRequired,
    handleSocialSwap: PropTypes.func.isRequired,
    renderChat: PropTypes.number.isRequired,
};

export default withWidth()(withStyles(styles)(Room));
