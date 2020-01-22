import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/lab/Slider';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

class Volume extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSlider: false,
            editingVolume: false,
            shouldHide: false,
            hideTimeout: null,
        };

        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleVolumeEditStart = this.handleVolumeEditStart.bind(this);
        this.handleVolumeEdit = this.handleVolumeEdit.bind(this);
        this.handleShowSlider = this.handleShowSlider.bind(this);
        this.handleHideSlider = this.handleHideSlider.bind(this);
        this.handleSoundStatusFlip = this.handleSoundStatusFlip.bind(this);
    }

    handleVolumeEditStart() {
        this.setState({ editingVolume: true });
    }
    handleVolumeEdit(e, volume) {
        this.props.setVolume(volume);
    }
    handleShowSlider() {
        clearTimeout(this.state.hideTimeout);
        this.setState({ showSlider: true });
    }
    handleHideSlider() {
        if (this.state.editingVolume) {
            this.setState({ shouldHide: true });
        }
        else {
            this.setState({
                hideTimeout: setTimeout(() => this.setState(
                    { showSlider: false }
                ), this.props.theme.transitions.duration.complex + 50),
            });
        }
    }
    handleSoundStatusFlip() {
        if (this.props.muted) {
            this.props.setVolume(this.props.volume);
        }
        else {
            this.props.mute();
        }
    }
    handleVolumeChange() {
        if (!this.props.muted) {
            this.props.setVolume(this.props.volume);
        }
        this.setState({
            editingVolume: false,
            shouldHide: false,
            hideTimeout: !this.state.shouldHide ? null : setTimeout(() => this.setState(
                { showSlider: false }
            )),
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div
                className={classes.volumeWrapper}
                onMouseLeave={this.handleHideSlider}
                onMouseEnter={
                    this.state.showSlider ? this.handleShowSlider : null
                }>
                <div className={classes.volumeSliderWrapper}>
                    {this.state.showSlider && (
                        <Slider
                            classes={{
                                root: classes.volumeSlider,
                            }}
                            disabled={
                                !this.state.showSlider ||
                                this.props.muted
                            }
                            min={0}
                            max={100}
                            step={1}
                            value={Number(this.props.volume)}
                            onChange={this.handleVolumeEdit}
                            onDragStart={this.handleVolumeEditStart}
                            onDragEnd={this.handleVolumeChange} />
                    )}
                </div>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title={this.props.muted ? 'Allow sound' : 'Disable sound'}>
                    <IconButton
                        onMouseEnter={this.handleShowSlider}
                        onClick={this.handleSoundStatusFlip}
                        classes={{ root: classes.mediumButton }}>
                        <Icon
                            classes={{ root: classes.mediumIcon }}>
                            {this.props.muted ?
                                'volume_off' :
                                'volume_up'}
                        </Icon>
                    </IconButton>
                </Tooltip>
            </div>
        );
    }
}

Volume.propTypes = {
    setVolume: PropTypes.func.isRequired,
    mute: PropTypes.func.isRequired,
    volume: PropTypes.number.isRequired,
    muted: PropTypes.bool.isRequired,
    theme: PropTypes.any.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Volume);
