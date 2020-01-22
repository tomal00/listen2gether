export default (theme) => ({
    paper: {
        width: 400,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.secondary,
        border: 0,
    },
    toolbar: theme.mixins.toolbar,
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '3px 0',
        height: 48,
        boxSizing: 'content-box',
        width: '100%',
    },
    headerPaper: {
        width: '95%',
        borderRadius: 30,
        margin: '15px auto 0',
    },
    rooms: {
        overflowY: 'scroll',
        listStyleType: 'none',
        margin: 0,
        width: 'calc(100% + 17px)',
        padding: '10px 17px 0 0',
        height: 'calc(100% - 64px)',
    },
    row: {
        margin: '15px 10px',
        display: 'grid',
        gridTemplateColumns: '10% 60% 30%',
        justifyItems: 'stretch',
        alignItems: 'center',
    },
    join: {
        gridColumnStart: '3',
        gridColumnEnd: '4',
        justifySelf: 'center',
        '&:hover': {
            backgroundColor: '#70bbf7',
        },
    },
    roomName: {
        gridColumnStart: '2',
        gridColumnEnd: '3',
    },
    truncatedText: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'pre',
        maxWidth: '100%',
        padding: '0 10px',
    },
    lockIcon: {
        color: theme.palette.primary.contrastText,
    },
    '@media (min-width:1920px)': {
        rooms: {
            height: 'calc(100% - 48px - 56px)',
        },
    },
    '@media (min-width:0px) and (orientation: landscape)': {
        rooms: {
            height: 'calc(100%  - 48px)',
        },
    },
    '@media (max-width:959px)': {
        rooms: {
            position: 'relative',
            left: 17,
        },
    },
});

