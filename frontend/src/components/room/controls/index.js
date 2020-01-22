import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import styles from './styles';
import Volume from '../../../containers/room/Volume';
import { withStyles } from '@material-ui/core/styles';
import SongProgress from '../../../containers/room/SongProgress';
import Tooltip from '@material-ui/core/Tooltip';

class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.handlePlaybackStatusFlip = this.handlePlaybackStatusFlip.bind(this);
        this.handleSkipNext = this.handleSkipNext.bind(this);
        this.handleSkipPrev = this.handleSkipPrev.bind(this);
        this.getNextUri = this.getNextUri.bind(this);
    }

    handlePlaybackStatusFlip() {
        if (this.props.paused) {
            this.props.unpause();
        }
        else {
            this.props.pause();
        }
    }
    handleSkipNext() {
        const nextUri = this.getNextUri(1);

        if (nextUri) {
            this.props.playTrack(nextUri);
        }
    }
    handleSkipPrev() {
        const nextUri = this.getNextUri(-1);

        if (nextUri) {
            this.props.playTrack(nextUri);
        }
    }
    getNextUri(val) {
        const uris = this.props.playlist.map((track) => track.trackInfo.uri);
        const currentUriIndex = uris.indexOf(this.props.currentlyPlaying);
        const nextUriIndex = currentUriIndex !== -1 ? currentUriIndex + val : -1;

        return nextUriIndex < uris.length && nextUriIndex >= 0 ? uris[nextUriIndex] : false;
    }
    render() {
        const { classes, paused } = this.props;
        const disableNext = this.getNextUri(1) == false;
        const disablePrev = this.getNextUri(-1) == false;
        const disableSwap = this.props.currentlyPlaying == false;

        return (
            <div className={classes.controls}>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title='Previous track'>
                    <div>
                        <IconButton
                            classes={{ root: classes.mediumButton }}
                            onClick={this.handleSkipPrev}
                            disabled={disablePrev}>
                            <Icon
                                classes={{ root: classes.mediumIcon }}>skip_previous</Icon>
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title={paused ? 'Play' : 'Pause'}>
                    <div>
                        <IconButton
                            onClick={this.handlePlaybackStatusFlip}
                            classes={{ root: classes.songStateButton }}
                            disabled={disableSwap}>
                            <Icon
                                classes={{ root: classes.songStateIcon }}>
                                {paused ? 'play_arrow' : 'pause'}
                            </Icon>
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title='Next track'>
                    <div>
                        <IconButton
                            classes={{ root: classes.mediumButton }}
                            onClick={this.handleSkipNext}
                            disabled={disableNext}>
                            <Icon
                                classes={{ root: classes.mediumIcon }}>
                                skip_next
                            </Icon>
                        </IconButton>
                    </div>
                </Tooltip>
                <Volume />
                <SongProgress />
            </div>
        );
    }
}

Controls.propTypes = {
    playTrack: PropTypes.func.isRequired,
    unpause: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    paused: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    currentlyPlaying: PropTypes.string.isRequired,
};

export default withStyles(styles)(Controls);
