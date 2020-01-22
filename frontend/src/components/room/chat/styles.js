export default () => ({
    chat: {
        height: 'calc(100% - 48px)',
        display: 'grid',
        gridTemplateColumns: '100%',
        gridTemplateRows: 'auto 1px 96px',
        overflow: 'hidden',
    },
    messages: {
        alignSelf: 'start',
        maxHeight: '100%',
        width: 'calc(100% + 17px)',
        listStyleType: 'none',
        margin: 0,
        padding: '15 32 15 15',
        overflowY: 'scroll',
    },
    chatMessage: {
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
    },
    chatControls: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messagesWrapper: {
        maxHeight: '100%',
        overflowY: 'scroll',
        position: 'relative',
        left: 17,
    },
    '@media (max-width:959px)': {
        chat: {
            width: '100%',
        },
    },
});
