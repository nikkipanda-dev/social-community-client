import { styled } from "../../../stitches.config";

const AnchorWrapper = styled('a', {
    transition: '$default',
    fontFamily: '$manjari',
    textDecoration: 'unset',
    color: '$pineGreen',
    '&.anchor-sm': {
        fontSize: '$small',
    },
    '&.anchor-md': {
        fontSize: '$medium',
    },
    '&.anchor-lg': {
        fontSize: '$large',
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
            }
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
        color: '$darkGray',
    }
});

export const Anchor = ({
    href,
    text,
    color,
    size,
    target,
    className,
    onClick,
    preventDefault,
    css,
}) => {
    return (
        <AnchorWrapper
            className={'' + (className ? (' ' + className) : '')}
            href={href}
            {...color & { color: color }}
            {...size & { size: size }}
            {...onClick && { onClick: () => onClick() }}
            {...preventDefault && { onClick: evt => evt.preventDefault() }}
            {...target & { target: target }}
            {...css & { css: { ...css } }}>
            {text}
        </AnchorWrapper>
    )
}

export default Anchor;