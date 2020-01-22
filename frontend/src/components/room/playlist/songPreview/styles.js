export default (theme) => ({
    songPreview: {
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        gridTemplateRows: '33% 67%',
        placeItems: 'stretch',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
    },
    songHeader: {
        gridColumnEnd: '2',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    truncatedText: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'pre',
        maxWidth: '100%',
        padding: '0 10px',
    },
    coverImg: {
        maxHeight: '100%',
        maxWidth: '100%',
        gridRowStart: '1',
        gridRowEnd: '3',
        gridColumnStart: '2',
        gridColumnEnd: '3',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    inactive: {
        border: '4px solid #808080',
    },
    active: {
        border: `4px solid ${theme.palette.primary.main}`,
    },
    '@media (max-height:735px)': {
        songPreview: {
            gridTemplateColumns: 'calc(100% - 140px)',
        },
    },
});
