import { styled } from "../../../stitches.config";

const CardWrapper = styled('div', {
    background: '$lightGray',
    variants: {
        size: {
            small: {
                maxWidth: '300px',
            },
            medium: {
                maxWidth: '400px',
            },
            large: {
                maxWidth: '800px',
            },
        },
        color: {
            white: {
                background: '$white',
            },
            transparent: {
                background: 'transparent',
            },
        },
    },
});

const CardHeaderWrapper = styled('div', {});

const CardBodyWrapper = styled('div', {});

const CardFooterWrapper = styled('div', {});

export const Card = ({
    header,
    className,
    css,
    children,
    footer,
    size,
    color,
}) => {
    return (
        <CardWrapper 
        className={' ' + (className ? (' ' + className) : '')} 
        css={{ ...css }}
        {...color && { color: color }}
        {...size && { size: size }}>
        {
            header &&
            <CardHeaderWrapper>{header}</CardHeaderWrapper>
        }
        <CardBodyWrapper>
            {children}
        </CardBodyWrapper>
        {
            footer &&
            <CardFooterWrapper>
                {footer}
            </CardFooterWrapper>
        }
        </CardWrapper>
    )
}

export default Card;