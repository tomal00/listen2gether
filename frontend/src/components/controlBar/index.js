import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import Nickname from './nickname';
import withWidth from '@material-ui/core/withWidth';
import Tooltip from '@material-ui/core/Tooltip';

class ControlBar extends React.Component {
    constructor(props) {
        super(props);
        this.changeNick = this.changeNick.bind(this);
    }

    changeNick(newNick) {
        this.props.changeNick(newNick);
    }

    render() {
        const { classes, width, lobbyOpened, nick, showError, closeLobby, openLobby, showHelp } = this.props;

        return (
            <AppBar
                classes={{ root: classes.appbar }}
                position='static'>
                <Toolbar
                    classes={{
                        root: lobbyOpened && (width === 'md' || width === 'lg') ?
                            classes.topMenuOverShadowed : classes.topMenu,
                    }}>
                    {
                        !(width === 'xs' || width === 'sm') &&
                        (!lobbyOpened || width === 'xl') &&
                        <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title={lobbyOpened ? 'Close lobby' : 'Open lobby'}>
                            <IconButton onClick={lobbyOpened ? closeLobby : openLobby}>
                                <Icon>{lobbyOpened ? 'chevron_left' : 'chevron_right'}</Icon>
                            </IconButton>
                        </Tooltip>
                    }
                    <div className={classes.rightAligner}>
                        <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title={'Help'}>
                            <IconButton onClick={showHelp}>
                                <Icon>{'help'}</Icon>
                            </IconButton>
                        </Tooltip>
                        <Nickname
                            changeNick={this.changeNick}
                            nick={nick}
                            showError={showError} />
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

ControlBar.propTypes = {
    classes: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
    lobbyOpened: PropTypes.bool.isRequired,
    closeLobby: PropTypes.func.isRequired,
    openLobby: PropTypes.func.isRequired,
    nick: PropTypes.string.isRequired,
    showHelp: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
};

export default withWidth()(withStyles(styles)(ControlBar));
