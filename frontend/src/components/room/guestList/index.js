import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import styles from './styles';
import { withStyles } from '@material-ui/core';

class GuestList extends React.Component {
    constructor(props) {
        super(props);
        this.kickClient = this.kickClient.bind(this);
    }

    kickClient(id) {
        this.props.kickClient(id);
    }

    render() {
        const { isAdmin, clients, classes } = this.props;

        return (
            <List className={classes.guestList}>
                {clients.map((client) => (
                    <ListItem key={client.id}>
                        <ListItemText primary={`${client.nick} (${client.id})`} />
                        {
                            isAdmin ? <ListItemSecondaryAction >
                                <IconButton onClick={() => this.kickClient(client.id)}>
                                    <Icon>remove</Icon>
                                </IconButton>
                            </ListItemSecondaryAction> :
                                null
                        }
                    </ListItem>
                ))}
            </List>
        );
    }
}

GuestList.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    clients: PropTypes.arrayOf(PropTypes.exact({
        id: PropTypes.string.isRequired,
        nick: PropTypes.string.isRequired,
    })).isRequired,
    kickClient: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GuestList);
