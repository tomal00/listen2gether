export default (theme) => ({
    nicknameWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    nicknameInput: {
        textAlign: 'right',
        fontSize: theme.typography.title.fontSize,
    },
    '@media (max-width: 410px)': {
        nicknameInput: {
            width: 180,
        },
    },
});
