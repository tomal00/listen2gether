import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

class NewRoomInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { roomName: '', password: '', passwordLocked: true };
        this.handleRoomNameEdit = this.handleRoomNameEdit.bind(this);
        this.handlePasswordEdit = this.handlePasswordEdit.bind(this);
        this.handlePasswordStatusFlip = this.handlePasswordStatusFlip.bind(this);
        this.handleConfirmation = this.handleConfirmation.bind(this);
        this.handleHide = this.handleHide.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.active !== this.props.active ||
            nextState.roomName !== this.state.roomName ||
            nextState.password !== this.state.password ||
            nextState.passwordLocked !== this.state.passwordLocked;
    }
    handleRoomNameEdit(e) {
        this.setState({ roomName: e.target.value });
    }
    handlePasswordEdit(e) {
        this.setState({ password: e.target.value });
    }
    handlePasswordStatusFlip() {
        this.setState({ passwordLocked: !this.state.passwordLocked });
    }
    handleConfirmation() {
        if (!/^\w{3,15}$/.test(this.state.roomName)) {
            this.props.showError('A room name must be between 3 and 15 characters long and must contain only aplha-numerical characters!');
        }
        else if (!this.state.passwordLocked && !/^\w{3,15}$/.test(this.state.password)) {
            this.props.showError('A password must be between 3 and 15 characters long and must contain only aplha-numerical characters!');
        }
        else {
            this.setState({ roomName: '', password: '', passwordLocked: true });
            this.props.createRoom(this.state.roomName, this.state.passwordLocked ? '' : this.state.password);
            this.props.hide();
        }
    }
    handleHide() {
        this.setState({ roomName: '', password: '', passwordLocked: true });
        this.props.hide();
    }
    render() {
        const title = 'Create a new room';
        const message = 'Choose a name and password for your new room.';

        return (
            <Dialog open={this.props.active}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                    <FormControl>
                        <InputLabel>{'Name'}</InputLabel>
                        <Input
                            onChange={this.handleRoomNameEdit}
                            placeholder={'Your room\'s name...'}
                            value={this.state.roomName}>
                        </Input>
                    </FormControl>
                    <FormControl>
                        <InputLabel>{'Password'}</InputLabel>
                        <Input
                            onChange={this.handlePasswordEdit}
                            placeholder={'Your room\'s password...'}
                            disabled={this.state.passwordLocked}
                            value={this.state.password}
                            type='password'
                            endAdornment={
                                <InputAdornment
                                    position='end'>
                                    <IconButton
                                        onClick={this.handlePasswordStatusFlip}>
                                        <Icon>{this.state.passwordLocked ? 'lock_open' : 'lock'}</Icon>
                                    </IconButton>
                                </InputAdornment>
                            }>
                        </Input>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleHide}>
                        {'Cancel'}
                    </Button>
                    <Button onClick={this.handleConfirmation}>
                        {'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

NewRoomInput.propTypes = {
    showError: PropTypes.func.isRequired,
    createRoom: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
};

export default NewRoomInput;
