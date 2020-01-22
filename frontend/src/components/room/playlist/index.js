import React from 'react';
import PropTypes from 'prop-types';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import SongPreview from './songPreview';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Tooltip from '@material-ui/core/Tooltip';
import AddTrackDialog from '../../../containers/room/AddTrackDialog';

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = { page: 1 };
        this.handleTrackAddition = this.handleTrackAddition.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);
        this.handlePrevPage = this.handlePrevPage.bind(this);
        this.playTrack = this.playTrack.bind(this);
    }
    handleTrackAddition() {
        this.props.showAddTrackDialog();
    }
    playTrack(trackUri) {
        this.props.playTrack(trackUri);
    }
    removeTrack(trackUri) {
        this.props.removeFromPlaylist(trackUri);
    }
    handleNextPage() {
        this.setState({ page: this.state.page + 1 });
    }
    handlePrevPage() {
        this.setState({ page: this.state.page - 1 });
    }
    render() {
        const { playlist, classes, currentlyPlaying, width } = this.props;
        const cols = width !== 'lg' && width !== 'xl' ? 1 : 2;
        const rows = 2;

        const listContent = playlist.slice(
            (this.state.page * rows * cols) - (rows * cols), this.state.page * rows * cols
        ).map((track) => (
            <GridListTile key={track.trackInfo.uri} classes={{ tile: classes.playListTile }}>
                <SongPreview
                    isActive={track.trackInfo.uri === currentlyPlaying}
                    trackInfo={track.trackInfo}
                    handlePlay={
                        () => this.playTrack(track.trackInfo.uri)
                    }
                    handleRemoval={
                        () => this.removeTrack(track.trackInfo.uri)
                    } >
                </SongPreview>
            </GridListTile>
        ));

        if (listContent.length % (rows * cols) !== 0 || listContent.length === 0) {
            listContent.push(
                <GridListTile
                    key={'addButton'}
                    classes={{ tile: classes.playListTile }}>
                    <Tooltip
                        disableFocusListener
                        disableTouchListener
                        title='Add new track'>
                        <IconButton onClick={this.handleTrackAddition}>
                            <Icon>playlist_add</Icon>
                        </IconButton>
                    </Tooltip>
                </GridListTile>
            );
        }

        while (listContent.length % (rows * cols) !== 0) {
            listContent.push(
                <GridListTile
                    key={`blankSpace${listContent.length}`}
                    classes={{ tile: classes.playListTile }}>
                    <div></div>
                </GridListTile>
            );
        }

        return (
            <div>
                <GridList
                    className={classes.playList}
                    cellHeight='auto'
                    spacing={24}
                    cols={cols}
                    style={{ margin: 0 }}>
                    {listContent}
                </GridList>
                <div className={classes.navigation}>
                    <div>
                        {
                            this.state.page > 1 &&
                            <Tooltip
                                disableFocusListener
                                disableTouchListener
                                title='Previous page'>
                                <IconButton
                                    onClick={this.handlePrevPage}
                                    classes={{ root: classes.navigationButton }}>
                                    <Icon
                                        classes={{ root: classes.navigationIcon }}>
                                        navigate_before
                                    </Icon>
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                    <div />
                    <div>
                        {
                            this.state.page <= Math.floor(playlist.length / (cols * rows)) &&
                            <Tooltip
                                disableFocusListener
                                disableTouchListener
                                title='Next page'>
                                <IconButton
                                    onClick={this.handleNextPage}
                                    classes={{ root: classes.navigationButton }}>
                                    <Icon
                                        classes={{ root: classes.navigationIcon }}>
                                        navigate_next</Icon>
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                </div>
                <AddTrackDialog />
            </div >
        );
    }
}

Playlist.propTypes = {
    playlist: PropTypes.arrayOf(PropTypes.shape({
        trackInfo: PropTypes.shape({
            uri: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    classes: PropTypes.object.isRequired,
    currentlyPlaying: PropTypes.string.isRequired,
    playTrack: PropTypes.func.isRequired,
    removeFromPlaylist: PropTypes.func.isRequired,
    width: PropTypes.string.isRequired,
};

export default withWidth()(withStyles(styles)(Playlist));
