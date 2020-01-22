import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

const CustomInput = ({ maxLength, handleInputEdit, val, className, handleStatusSwap, handleInputCommit, adornmentPos }) => {
    let startAdornment;
    let endAdornment;

    if (adornmentPos === 'start') {
        startAdornment = (
            <InputAdornment position='start'>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title='Cancel'>
                    <IconButton onClick={handleStatusSwap}>
                        <Icon>{'cancel'}</Icon>
                    </IconButton>
                </Tooltip>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title='Confirm'>
                    <IconButton onClick={handleInputCommit}>
                        <Icon>{'check_circle'}</Icon>
                    </IconButton>
                </Tooltip>
            </InputAdornment>
        );
        endAdornment = null;
    }
    else {
        endAdornment = (
            <InputAdornment position='end'>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title='Cancel'>
                    <IconButton onClick={handleStatusSwap}>
                        <Icon>{'cancel'}</Icon>
                    </IconButton>
                </Tooltip>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title='Confirm'>
                    <IconButton onClick={handleInputCommit}>
                        <Icon>{'check_circle'}</Icon>
                    </IconButton>
                </Tooltip>
            </InputAdornment>
        );
        startAdornment = null;
    }

    return (
        <Input
            onChange={handleInputEdit}
            value={val}
            classes={{ input: className }}
            inputProps={{ maxLength }}
            startAdornment={startAdornment}
            endAdornment={endAdornment}>
            {val}
        </Input>
    );
};

CustomInput.propTypes = {
    maxLength: PropTypes.number.isRequired,
    handleInputEdit: PropTypes.func.isRequired,
    val: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    handleStatusSwap: PropTypes.func.isRequired,
    handleInputCommit: PropTypes.func.isRequired,
    adornmentPos: PropTypes.string.isRequired,
};

export default CustomInput;
