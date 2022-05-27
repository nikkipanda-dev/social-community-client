import { useState, useEffect, } from "react";
import { imageModalPreview, } from "../../../stitches.config";
import { styled } from "../../../stitches.config";

import ImagePreview from "../ImagePreview";
import Image from "../../core/Image";
import Modal from "../Modal";

const ImagesPreviewWrapper = styled('div', {});

const ImageModalPreview = styled('div', {});

export const ImagesPreview = ({ 
    images, 
    bodyClassName, 
    bodyCss,
    className,
    css,
}) => {
    const [path, setPath] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const handlePath = path => setPath(path);

    const handleShowModal = path => {
        handlePath(path);
        setIsVisible(true);
    };
    const handleHideModal = () => setIsVisible(false);

    return (
        <ImagesPreviewWrapper className={' ' + (bodyClassName ? (' ' + bodyClassName) : '')} {...bodyCss && { css: { ...bodyCss } }}>
        {
            (images && (Object.keys(images).length > 0)) && 
            Object.keys(images).map((i, val) => <ImagePreview 
            key={i}
            values={Object.values(images)[val]} 
            className={className}
            css={css}
            isVisible={isVisible}
            handleHideModal={handleHideModal}
            onClick={handleShowModal} />)
        }
            <Modal
            isVisible={isVisible}
            closable={false}
            maskClosable={true}
            width="50%"
            onCancel={handleHideModal}>
                <ImageModalPreview css={imageModalPreview}>
                    <Image
                    css={{ width: '100%' }}
                    src={path} />
                </ImageModalPreview>
            </Modal>
        </ImagesPreviewWrapper>
    )
}

export default ImagesPreview;