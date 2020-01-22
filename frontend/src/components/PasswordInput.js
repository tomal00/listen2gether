import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

class PasswordInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { password: '' };
        this.handlePasswordEdit = this.handlePasswordEdit.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.handleConfirmation = this.handleConfirmation.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.active !== this.props.active ||
            nextState.password !== this.state.password;
    }
    handlePasswordEdit(e) {
        this.setState({ password: e.target.value });
    }
    handleHide() {
        this.setState({ password: '' });
        this.props.hide();
    }
    handleConfirmation() {
        this.setState({ password: '' });
        this.props.joinRoom(this.props.roomId, this.state.password);
        this.props.hide();
    }
    render() {
        const title = 'Password';
        const message = 'Enter password of the room';

        return (
            <Dialog open={this.props.active}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                    <FormControl>
                        <InputLabel>{'Password'}</InputLabel>
                        <Input
                            onChange={this.handlePasswordEdit}
                            placeholder={'Enter password here...'}
                            value={this.state.password}
                            type='password'>
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

PasswordInput.propTypes = {
    hide: PropTypes.func.isRequired,
    roomId: PropTypes.number,
    active: PropTypes.bool.isRequired,
    joinRoom: PropTypes.func.isRequired,
};

export default PasswordInput;
