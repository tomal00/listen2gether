import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import styles from './styles';
import { withStyles } from '@material-ui/core';
const SongPreview = ({ trackInfo, classes, handlePlay, handleRemoval, isActive }) => (
    <div>
        <Card classes={{
            root: `${classes.songPreview} ${isActive ? classes.active : classes.inactive}`,
        }}>
            <div className={classes.songHeader}>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title='Remove track'>
                    <IconButton onClick={handleRemoval}>
                        <Icon>clear</Icon>
                    </IconButton>
                </Tooltip>
                <Typography
                    title={trackInfo.name}
                    classes={{ root: classes.truncatedText }}
                    variant='subheading'>
                    {trackInfo.name}
                </Typography>
            </div>
            <CardContent>
                <Typography
                    title={`Artist: ${trackInfo.artists.join(', ')}`}
                    classes={{ root: classes.truncatedText }}>
                    {`Artist: ${trackInfo.artists.join(', ')}`}
                </Typography>
                <Typography
                    title={`Album: ${trackInfo.album}`}
                    classes={{ root: classes.truncatedText }}>
                    {`Album: ${trackInfo.album}`}
                </Typography>
            </CardContent >
            <Tooltip
                disableFocusListener
                disableTouchListener
                title='Click to play'>
                <CardMedia
                    classes={{ root: classes.coverImg }}
                    image={trackInfo.albumImg.url}
                    onClick={handlePlay} />
            </Tooltip>
        </Card >
    </div>
);

SongPreview.propTypes = {
    trackInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        artists: PropTypes.arrayOf(PropTypes.string).isRequired,
        album: PropTypes.string.isRequired,
        albumImg: PropTypes.shape({
            url: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    classes: PropTypes.object.isRequired,
    handlePlay: PropTypes.func.isRequired,
    handleRemoval: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
};

export default withStyles(styles)(SongPreview);
