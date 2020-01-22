import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './styles';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#4dabf5',
            contrastText: '#ffffff',
        },
    },
});

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentMessage: '' };
        this.handleMessageEdit = this.handleMessageEdit.bind(this);
        this.handleMessageSend = this.handleMessageSend.bind(this);
    }
    handleMessageEdit(e) {
        this.setState({ currentMessage: e.target.value });
    }
    handleMessageSend(e) {
        if (!e.key || e.key === 'Enter') {
            const msg = this.state.currentMessage.match(/^\s*(.{0,249}\S)\s*$/);

            if (msg) {
                this.props.sendChatMessage(msg[1]);
                this.setState({ currentMessage: '' });
            }
            else {
                this.props.showError('A chat message must be between 1 and 250 characters long.');
            }
        }
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.chatControls}>
                <MuiThemeProvider theme={theme}>
                    <TextField
                        multiline={false}
                        onChange={this.handleMessageEdit}
                        onKeyDown={this.handleMessageSend}
                        label='Your message...'
                        value={this.state.currentMessage}
                        color='secondary' />
                </MuiThemeProvider>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title='Send message'>
                    <IconButton onClick={this.handleMessageSend} >
                        <Icon color='secondary'>send</Icon>
                    </IconButton>
                </Tooltip>
            </div>
        );
    }
}

Chat.propTypes = {
    sendChatMessage: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Chat);
