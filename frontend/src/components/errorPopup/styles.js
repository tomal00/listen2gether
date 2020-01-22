export default (theme) => ({
    root: {
        backgroundColor: theme.palette.error.dark,
    },
    icon: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 18,
    },
    closeButton: {
        height: 36,
        width: 36,
        justifySelf: 'self-end',
    },
    snackbarMessage: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'auto auto',
    },
});
