import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CustomInput from '../../CustomInput';
import styles from './styles';
import Tooltip from '@material-ui/core/Tooltip';

class Nickname extends React.Component {
    constructor(props) {
        super(props);
        this.state = { newNick: props.nick, changing: false };
        this.onNickChange = this.onNickChange.bind(this);
        this.onNickEdit = this.onNickEdit.bind(this);
        this.onStatusSwap = this.onStatusSwap.bind(this);
        this.handleStatusSwap = this.onStatusSwap.bind(this);
    }
    onNickChange() {
        if (/^\w{3,15}$/.test(this.state.newNick)) {
            this.props.changeNick(this.state.newNick);
            this.setState({ changing: false, newNick: this.props.nick });
        }
        else {
            this.props.showError('A nickname must be between 3 and 15 characters long and must contain only alpha - numerical characters.');
        }
    }
    onNickEdit(e) {
        this.setState({ newNick: e.target.value });
    }
    onStatusSwap() {
        this.setState({ changing: !this.state.changing, newNick: this.props.nick });
    }
    render() {
        const { classes, nick } = this.props;

        return (
            <div className={classes.nicknameWrapper}>
                {
                    this.state.changing ?
                        <CustomInput
                            handleInputEdit={this.onNickEdit}
                            val={this.state.newNick}
                            className={classes.nicknameInput}
                            handleStatusSwap={this.onStatusSwap}
                            handleInputCommit={this.onNickChange}
                            adornmentPos='start'
                            maxLength={15} /> :
                        <React.Fragment>
                            <Tooltip
                                disableFocusListener
                                disableTouchListener
                                title='change nick'>
                                <IconButton onClick={this.handleStatusSwap}>
                                    <Icon>{'edit'}</Icon>
                                </IconButton>
                            </Tooltip>
                            <Typography
                                variant='title'
                                title={nick} >
                                {nick}
                            </Typography>
                        </React.Fragment>
                }
            </div>
        );
    }
}

Nickname.propTypes = {
    nick: PropTypes.string.isRequired,
    changeNick: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Nickname);
