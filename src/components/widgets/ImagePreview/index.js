import { imagePreview } from "../../../stitches.config";
import { styled } from "../../../stitches.config";

import Image from "../../core/Image";

const ImagePreviewWrapper = styled('div', {
    'img': imagePreview
});

export const ImagePreview = ({
    values,
    className,
    css,
    alt,
    onClick,
}) => {    
    return (
        <ImagePreviewWrapper>
            <Image
            className={' ' + (className ? (' ' + className) : '')}
            {...css && { css: { ...css } }}
            src={(values && values.path)}
            {...alt && { alt: alt }}
            {...onClick && { onClick: () => onClick((values && values.path)) }} />
        </ImagePreviewWrapper>
    )
}

export default ImagePreview;