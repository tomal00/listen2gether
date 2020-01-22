import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import MessageInput from './MessageInput';
import Messages from './Messages';

class Chat extends React.Component {
    render() {
        const { classes, messages } = this.props;

        return (
            <div className={classes.chat}>
                <Messages
                    classes={classes}
                    messages={messages} />
                <Divider />
                <MessageInput
                    sendChatMessage={this.props.sendChatMessage}
                    showError={this.props.showError}
                    classes={this.props.classes} />
            </div>
        );
    }
}

Chat.propTypes = {
    sendChatMessage: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    messages: PropTypes.arrayOf(PropTypes.exact({
        key: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        sender: PropTypes.exact({
            nick: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
};

export default withStyles(styles)(Chat);
