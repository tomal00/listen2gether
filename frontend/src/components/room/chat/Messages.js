import React from 'react';
import Typography from '@material-ui/core/Typography';

class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrolledDown: true,
        };

        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    scrollToBottom() {
        this.messagesEnd.scrollIntoView();
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        if (this.state.scrolledDown) {
            this.scrollToBottom();
        }
    }

    handleScroll(e) {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

        if (bottom) {
            this.setState({ scrolledDown: true });
        }
        else {
            this.setState({ scrolledDown: false });
        }
    }

    render() {
        const { classes, messages } = this.props;

        return (
            <ul
                className={classes.messages}
                onScroll={this.handleScroll}>
                {messages.map((message) =>
                    (<li key={message.key + message.sender.id} >
                        <div>
                            <Typography>
                                {`${message.sender.nick} (${message.sender.id})`}
                            </Typography>
                        </div>
                        <div>
                            <Typography classes={{ root: classes.chatMessage }}>
                                {message.content}
                            </Typography>
                        </div>
                    </li>)).reverse()
                }
                <div style={{ float: 'left', clear: 'both' }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </ul>
        );
    }
}

export default Messages;
