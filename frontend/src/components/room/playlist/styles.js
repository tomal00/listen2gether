export default () => ({
    playListTile: {
        width: 380,
        height: 190,
        overflow: 'visible',
    },
    playList: {
        width: '100%',
    },
    navigation: {
        display: 'grid',
        gridTemplateColumns: '48px auto 48px',
        position: 'absolute',
        width: 'calc(100% + 96px)',
        top: 'calc(50% - 24px)',
        left: '-48px',
    },
    '@media (max-height:735px)': {
        playListTile: {
            height: 140,
        },
    },
    '@media (max-width:599px)': {
        playListTile: {
            width: 280,
            height: 140,
        },
        navigation: {
            gridTemplateColumns: '28px auto 28px',
            width: 'calc(100% + 56px)',
            top: 'calc(50% - 14px)',
            left: '-28px',
        },
        navigationButton: {
            width: 28,
            height: 28,
        },
        navigationIcon: {
            fontSize: 18,
        },
    },
});
