import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import QueryList from '../../../../containers/room/queryList';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import styles from './styles';

class AddTrackDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { searchQuery: '' };
        this.handleClose = this.handleClose.bind(this);
        this.handleSearchQueryEdit = this.handleSearchQueryEdit.bind(this);
        this.onTrackSelect = this.onTrackSelect.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.handleExit = this.handleExit.bind(this);
    }
    handleClose() {
        this.props.hideAddTrackDialog();
    }
    onTrackSelect(trackUri) {
        this.props.addToPlaylist(trackUri);
        this.setState({ searchQuery: '' });
        this.props.hideAddTrackDialog();
    }
    handleSearchQueryEdit(e) {
        this.setState({ searchQuery: e.target.value });
    }
    handleQuery() {
        this.props.requestQuery(this.state.searchQuery, this.props.access_token);
    }
    handleExit() {
        this.setState({ searchQuery: '' });
        this.props.exitAddTrackDialog();
    }
    render() {
        return (
            <Dialog
                open={this.props.active}
                onBackdropClick={this.handleClose}
                onExited={this.handleExit}>
                <DialogTitle>{'Add a new track'}</DialogTitle>
                <DialogContent>
                    <FormControl
                        classes={{ root: this.props.classes.searchBar }}>
                        <InputLabel>{'Search'}</InputLabel>
                        <Input
                            onChange={this.handleSearchQueryEdit}
                            placeholder={'Search for a track...'}
                            value={this.state.searchQuery}
                            classes={{ root: this.props.classes.searchInput }}>
                        </Input>
                        <IconButton
                            onClick={this.handleQuery}>
                            <Icon>search</Icon>
                        </IconButton>
                    </FormControl>
                    <Divider />
                    <QueryList handleTrackSelect={this.onTrackSelect} />
                </DialogContent>
            </Dialog>
        );
    }
}

AddTrackDialog.propTypes = {
    active: PropTypes.bool.isRequired,
    addToPlaylist: PropTypes.func.isRequired,
    exitAddTrackDialog: PropTypes.func.isRequired,
    requestQuery: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    hideAddTrackDialog: PropTypes.func.isRequired,
    classes: PropTypes.any.isRequired,
};

export default withStyles(styles)(AddTrackDialog);
