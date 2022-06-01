import { forwardRef, } from "react";
import { styled } from "../../../stitches.config";

const ButtonWrapper = styled('button', {
    transition: '$default',
    fontFamily: '$manjari',
    background: '#f1f1f1',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '$default',
    padding: '$space-2 $space-3 $space-1',
    '&.button-xs': {
        fontSize: '$tiny',
    },
    '&.button-sm': {
        fontSize: '$small',
    },
    '&.button-md': {
        fontSize: '$medium',
    },
    '&.button-lg': {
        fontSize: '$large',
    },
    '&.button-plain:hover': {
        background: 'transparent',
        color: '$pineGreen',
    },
    '&.button-plain-red:hover': {
        background: 'transparent',
        color: '$orangeRedCrayola',
    },
    variants: {
        color: {
            brown: {
                background: '$sealBrown',
                color: '$white',
                '&:hover': {
                    background: '#442300',
                },
            },
            orange: {
                background: '$orangePeel',
                color: '$white',
                '&:hover': {
                    background: '#f58e00',
                },
            },
            red: {
                background: '$orangeRedCrayola',
                color: '$white',
                '&:hover': {
                    background: '#de3c3c',
                },
            },
            white: {
                background: '$white',
                color: '$sealBrown',
                '&:hover': {
                    background: '$lightGray1',
                },
            },
            transparent: {
                background: 'none',
            },
        },
        outline: {
            brown: {
                color: '$black',
                background: 'transparent',
                border: '$sealBrown',
                borderStyle: '$default',
                borderWidth: '$default',
                '&:hover': {
                    color: '$white',
                    background: '$sealBrown',
                },
            },
            orange: {
                color: '$black',
                background: 'transparent',
                border: '$orangePeel',
                borderStyle: '$default',
                borderWidth: '$default',
                '&:hover': {
                    color: '$white',
                    background: '$orangePeel',
                },
            },
            red: {
                color: '$black',
                background: 'transparent',
                border: '$orangeRedCrayola',
                borderStyle: '$default',
                borderWidth: '$default',
                '&:hover': {
                    color: '$white',
                    background: '$orangeRedCrayola',
                },
            },
        },
    },
    '&:hover': {
        background: '#d6d6d6',
    }
});

export const Button = forwardRef(({
    className,
    css,
    text,
    color,
    outline,
    onClick,
    evtOnclick,
    onMouseEnter,
    onMouseLeave,
    type,
}, ref) => {
    return (
        <ButtonWrapper
            {...color && { color: color }}
            {...outline && { outline: outline }}
            {...ref && {ref: ref}}
            {...type && { type: type }}
            {...onClick && { onClick: () => onClick() }}
            {...onMouseLeave && { onMouseLeave: () => onMouseLeave() }}
            {...onMouseEnter && { onMouseEnter: () => onMouseEnter() }}
            {...evtOnclick && { onClick: evt => evtOnclick(evt) }}
            className={'' + (className ? (' ' + className) : '')}
            {...css && { css: { ...css } }}>
            {text}
        </ButtonWrapper>
    )
});

export default Button;