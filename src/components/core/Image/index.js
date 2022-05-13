import { styled } from "../../../stitches.config";

const ImageWrapper = styled('img', {
    variants: {
        size: {
            small: {
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
            },
            medium: {
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
            },
        }
    }
});

export const Image = ({
    className,
    size,
    css,
    src,
    alt,
    onClick,
    evtOnclick,
    onMouseOver,
    onMouseOut,
}) => {
    return (
        <ImageWrapper
            className={className}
            css={{ ...css }}
            {...size && { size: size }}
            src={src}
            {...onClick && { onClick: () => onClick() }}
            {...onMouseOut && { onMouseOut: () => onMouseOut() }}
            {...onMouseOver && { onMouseOver: () => onMouseOver() }}
            {...evtOnclick && { onClick: evt => evtOnclick(evt) }}
            {...alt && { alt: alt }} />
    )
}

export default Image;