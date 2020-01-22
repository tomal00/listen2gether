export default (theme) => ({
    toolbar: theme.mixins.toolbar,
    roomWrapper: {
        position: 'relative',
        height: '100%',
    },
    roomWrapperFull: {
        width: '100%',
        transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    roomWrapperReduced: {
        width: 'calc(100% - 400px)',
        transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    room: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'auto 320px',
        gridTemplateRows: '100px auto 160px',
        justifyItems: 'stretch',
        alignItems: 'center',
    },
    headerPaper: {
        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 1,
        gridRowEnd: 2,
        borderRadius: '30px',
        width: '90%',
        justifySelf: 'center',
        height: 'calc(100% - 25px)',
        marginTop: 25,
    },
    roomHeader: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto',
        justifyItems: 'center',
        alignItems: 'center',
        height: '100%',
        width: '95%',
        margin: '0 auto',
    },
    controlsWrapper: {
        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 3,
        gridRowEnd: 4,
        width: 350,
        justifySelf: 'center',
        alignSelf: 'center',
    },
    playListWrapper: {
        position: 'relative',
        width: (songPreviewBounds.width + 24) * 2,
        alignSelf: 'center',
        justifySelf: 'center',
        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 2,
        gridRowEnd: 3,
    },
    socialWrapper: {
        maxHeight: '100%',
        overflow: 'hidden',
        alignSelf: 'stretch',
        gridColumnStart: 2,
        gridColumnEnd: 3,
        gridRowStart: 1,
        gridRowEnd: 4,
        backgroundColor: theme.palette.background.secondary,
    },
    truncatedText: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'pre',
        maxWidth: '100%',
        padding: '0 10px',
    },
    '@media (max-width:1279px)': {
        playListWrapper: {
            width: songPreviewBounds.width + 24,
        },
    },
    '@media (max-width:959px)': {
        playListWrapper: {
            alignSelf: 'center',
            justifySelf: 'center',
        },
        playerWrapper: {
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        },
        headerPaper: {
            gridColumnStart: 1,
            gridColumnEnd: 3,
            width: '100%',
            height: '75%',
            alignSelf: 'start',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
        },
        roomHeader: {
            gridTemplateColumns: '50% 50%',
            width: '90%',
            margin: '25 auto',
            gridTemplateRows: '128 64',
        },
    },
    '@media (max-width:599px)': {
        controlsWrapper: {
            width: 300,
        },
        playListWrapper: {
            width: (songPreviewBounds.heightS * 2) + 24,
        },
    },
});

const songPreviewBounds = {
    width: 380,
    heightL: 190,
    heightS: 140,
};
