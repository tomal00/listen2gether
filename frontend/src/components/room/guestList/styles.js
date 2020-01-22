export default () => ({
    guestList: {
        padding: '8px 17px 8px 0',
        overflowY: 'scroll',
        boxSizing: 'content-box',
        position: 'relative',
        left: 17,
    },
    '@media (max-width:959px)': {
        guestList: {
            width: '300px',
            padding: '8px calc(50% - 133px) 8px calc(50% - 150px)',
        },
    },
    '@media (max-width:599px)': {
        guestList: {
            width: '50%',
            padding: '8px 25%',
        },
    },
});
