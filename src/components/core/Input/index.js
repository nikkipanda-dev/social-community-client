import React from "react";
import { styled } from "../../../stitches.config";

const InputWrapper = styled('input', {});

export const Input = React.forwardRef(({
    type,
    className,
    accept,
    name,
    id,
    hidden,
    css,
    onChange,
}, ref) => {
    return (
        <InputWrapper
            className={'' + (className ? (' ' + className) : '')}
            {...ref && { ref: ref }}
            {...onChange && { onChange: evt => onChange(evt) }}
            {...type && { type: type }}
            {...id && { id: id }}
            {...accept && { hidden }}
            {...accept && { accept: accept }}
            {...name && { name: name }}
            {...css && { css: { ...css } }} />
    )
});

export default Input;