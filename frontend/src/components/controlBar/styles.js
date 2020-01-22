export default (theme) => ({
    appbar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.primary.dark,
    },
    topMenu: {
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        alignItems: 'center',
    },
    topMenuOverShadowed: {
        display: 'grid',
        gridTemplateColumns: 'auto',
        alignItems: 'center',
    },
    rightAligner: {
        display: 'flex',
        justifySelf: 'end',
    },
    '@media (max-width: 959px)': {
        rightAligner: {
            justifySelf: 'center',
        },
        topMenu: {
            gridTemplateColumns: 'auto',
        },
    },
});
