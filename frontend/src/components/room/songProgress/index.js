import React from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/lab/Slider';
import styles from './styles';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

class SongProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = { firstDragEnd: false, firstChange: false };

        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.tick = this.tick.bind(this);

        const callback = (position) => {
            if (position) {
                this.props.moveTime(position);
            }
            this.ticker = setInterval(this.tick, 1000);
        };

        this.props.spotifyPlayer.getCurrentState()
            .then((data) => callback(data.position))
            .catch(() => callback());
    }
    componentWillUnmount() {
        clearInterval(this.ticker);
    }
    tick() {
        if (this.props.allowUpdates && this.props.currentlyPlaying) {
            this.props.tick();
        }
    }
    handleDragEnd() {
        if (!this.state.firstDragEnd && !this.state.firstChange) {
            this.setState({ firstDragEnd: true });
        }
        else if (this.state.firstChange) {
            this.props.movePlayback(
                (
                    this.props.currentTime < this.props.maxTime - 1000 ?
                        this.props.currentTime : this.props.maxTime - 1000
                ) || 1
            );
            this.setState({ firstChange: false });
        }
    }
    handleChange(e, val) {
        if (!this.state.firstDragEnd && !this.state.firstChange) {
            this.setState({ firstChange: true });
            this.props.moveTime(val * 1000);
        }
        else if (this.state.firstChange) {
            this.props.moveTime(val * 1000);
        }
        else if (this.state.firstDragEnd) {
            this.props.movePlayback(
                (
                    val * 1000 < this.props.maxTime - 1000 ?
                        val * 1000 : this.props.maxTime - 1000
                ) || 1
            );
            this.setState({ firstDragEnd: false });
        }
    }

    render() {
        const { classes, currentTime, maxTime } = this.props;

        return (
            <React.Fragment>
                <div className={classes.progressWrapper}>
                    <div
                        className={classes.progressSliderWrapper} >
                        <Slider
                            value={Number(currentTime) / 1000}
                            onChange={this.handleChange}
                            max={Number(maxTime) / 1000}
                            min={0}
                            onDragEnd={this.handleDragEnd} />
                    </div>
                </div>
                <Typography
                    classes={{ root: classes.timeLabel }}
                    variant='body2'>
                    {`${Math.floor(currentTime / 60000)} : ${((currentTime % 60000) / 1000) < 10 ? '0' : ''}${Math.floor((currentTime % 60000) / 1000)}`}
                </Typography>
            </React.Fragment>
        );
    }
}

SongProgress.propTypes = {
    movePlayback: PropTypes.func.isRequired,
    moveTime: PropTypes.func.isRequired,
    currentlyPlaying: PropTypes.string.isRequired,
    maxTime: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    allowUpdates: PropTypes.bool.isRequired,
};

export default withStyles(styles)(SongProgress);
