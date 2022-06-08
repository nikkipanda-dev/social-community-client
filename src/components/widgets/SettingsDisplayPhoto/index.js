import { forwardRef, } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { styled } from "../../../stitches.config";

import Image from "../../core/Image";
import Text from "../../core/Text";
import Button from "../../core/Button";

const SettingsDpWrapper = styled('div', {});

const LabelWrapper = styled('label', {
    background: '$white',
    width: '100px',
    height: '100px',
    borderRadius: '$default',
    '&:hover': {
        cursor: 'pointer',
    },
});

const SubmitButtonWrapper = styled('div', {});

const ImageWrapper = styled('div', {});

export const SettingsDisplayPhoto = forwardRef(({
    handleImageChange,
    handleRemoveImage,
    imageUrls,
    updateFn,
    className,
    css,
    imageHelp,
}, ref) => {
    return (
        <SettingsDpWrapper className={'d-flex flex-column justify-content-center align-items-center ' + (className ? (' ' + className) : '')} {...css && {css: {...css}}}>
        <input
        id="images"
        name="image"
        type="file"
        accept="image/*"
        ref={ref}
        hidden
        onChange={() => handleImageChange()} />
        {
            (Object.keys(imageUrls).length === 0) && 
            <LabelWrapper htmlFor="images" className="d-flex flex-column justify-content-evenly align-items-center">
                <FontAwesomeIcon icon={faArrowUpFromBracket} className="fa-fw fa-xl" /><Text type="span" color="darkGray">Upload</Text>
            </LabelWrapper>
        }
        {
            imageHelp && <Text type="span" color="red">{imageHelp}</Text>
        }
        {
            (imageUrls && (Object.keys(imageUrls).length > 0)) && 
            <>
            {
                Object.keys(imageUrls).map((i, val) => {
                    return (
                        <ImageWrapper key={i} className="d-flex flex-column">
                            <Image src={Object.values(imageUrls)[val].src} css={{
                                width: '300px',
                                height: '300px',
                                objectFit: 'cover',
                                borderRadius: '$default',
                            }} />
                            <Button
                            type="button"
                            text="Remove"
                            className="button-plain-red"
                            color="transparent"
                            onClick={() => handleRemoveImage(Object.values(imageUrls)[val].name)} />
                        </ImageWrapper>
                    )
                })
            }
                <SubmitButtonWrapper className="d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between align-items-sm-center" css={{ width: '100%', marginTop: '$space-3', }}>
                    <Button
                    type="button"
                    className="flex-grow-1 flex-sm-grow-0 mt-5 mt-sm-0 mx-sm-auto"
                    onClick={() => updateFn()}
                    text="Save"
                    color="brown" />
                </SubmitButtonWrapper>
            </>
        }
        </SettingsDpWrapper>
    )
});

export default SettingsDisplayPhoto;