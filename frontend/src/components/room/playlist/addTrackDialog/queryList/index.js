import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { Icon, withStyles } from '@material-ui/core';
import styles from './styles';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const QueryList = ({ handleTrackSelect, classes, tracks, fetched }) => (
    <React.Fragment>
        <List>
            {tracks.map((track) => (
                <ListItem key={track.uri} >
                    <Avatar src={track.albumImgUri} />
                    <ListItemText
                        classes={{
                            root: classes.songTitle,
                            primary: classes.truncatedText,
                            secondary: classes.truncatedText,
                        }}
                        primary={track.name}
                        secondary={track.artist}
                        title={`${track.name} - ${track.artist}`} />
                    <ListItemSecondaryAction>
                        <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title='Add to playlist'>
                            <IconButton
                                onClick={() => handleTrackSelect(track.uri)}>
                                <Icon>add</Icon>
                            </IconButton>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
        {
            fetched && !tracks.length ? (
                <Typography
                    title={'No results were found...'} >
                    {'No results were found...'}
                </Typography>
            ) : null
        }
    </React.Fragment>
);

QueryList.propTypes = {
    handleTrackSelect: PropTypes.func.isRequired,
    fetched: PropTypes.bool.isRequired,
    classes: PropTypes.any.isRequired,
    tracks: PropTypes.arrayOf(
        PropTypes.shape(
            {
                name: PropTypes.string,
                artist: PropTypes.string,
                albumImgUri: PropTypes.string,
                uri: PropTypes.string,
            }
        ).isRequired
    ).isRequired,
};

export default withStyles(styles)(QueryList);
