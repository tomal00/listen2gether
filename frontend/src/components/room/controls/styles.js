export default () => ({
    controls: {
        display: 'grid',
        gridTemplateRows: '50% 25% 25%',
        gridTemplateColumns: '15% 30% 15% 40%',
        justifyItems: 'center',
        alignItems: 'center',
    },
    songStateButton: {
        height: 88,
        width: 88,
    },
    songStateIcon: {
        fontSize: 64,
    },
    mediumButton: {
        height: 58,
        width: 58,
    },
    mediumIcon: {
        fontSize: 34,
    },
    volumeWrapper: {
        position: 'relative',
    },
    volumeSliderWrapper: {
        position: 'absolute',
        width: 120,
        height: '100%',
        left: '100%',
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    volumeSlider: {
        height: 0,
        margin: 0,
    },
    '@media (max-width:599px)': {
        songStateButton: {
            height: 66,
            width: 66,
        },
        songStateIcon: {
            fontSize: 47,
        },
        mediumButton: {
            height: 34.5,
            width: 34.5,
        },
        mediumIcon: {
            fontSize: 25.5,
        },
        volumeSliderWrapper: {
            width: 70,
        },
    },
});
