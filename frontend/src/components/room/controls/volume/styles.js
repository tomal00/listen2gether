export default () => ({
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
