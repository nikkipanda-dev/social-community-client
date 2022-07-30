import { 
    useState, 
    useEffect, 
    useRef,
    forwardRef,
} from "react";
import { styled } from "../../../stitches.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFaceSmile, 
    faTrash,
    faImages,
} from "@fortawesome/free-solid-svg-icons";

import PostMessage from "../PostMessage";
import Text from "../../core/Text";
import Image from "../../core/Image";
import Button from "../../core/Button";
import MessagesContainer from "../MessagesContainer";

const MessagesMainWrapper = styled('div', {});

const MessagesContainerWrapper = styled('div', {
    width: '100%',
    height: '60vh',
    overflow: 'auto',
    overflowX: 'hidden',
});

const MessagesTextareaWrapper = styled('div', {
    '.emoji-toggler:hover': {
        cursor: 'pointer',
    },
});

const ImageWrapper = styled('div', {});

const ContainerWrapper = styled('div', {});

const LabelWrapper = styled('label', {
    ':hover': {
        cursor: 'pointer',
    },
});

export const MessagesMain = forwardRef(({ 
    storeFn, 
    isAuth, 
    form,
    handleShowModal,
    messages,
    imageUrls,
    friendDisplayPhoto,
    friendUsername,
    handleImageChange,
    handleRemoveImage,
    displayPhoto,
}, ref) => {
    //TODO: paginate messages
    
    const emojiRef = useRef('');

    const [isEmojiShown, setIsEmojiShown] = useState(false);
    const [message, setMessage] = useState('');

    const handleToggleEmoji = () => setIsEmojiShown(!(isEmojiShown));
    const handleMessage = message => setMessage(message);

    const onEmojiClick = (event, emojiObject) => {
        console.log(emojiObject);
        console.info('form vals ', form.getFieldsValue());
        handleMessage((form.getFieldsValue().message ? form.getFieldsValue().message : '') + emojiObject.emoji);
    };

    useEffect(() => {
        let loading = true;

        if (loading) {
            form.setFieldsValue({message: message});
        }

        return () => {
            loading = false;
        }
    }, [message]);
    
    return (
        <MessagesMainWrapper>
            <MessagesContainerWrapper>
                <MessagesContainer 
                messages={messages} 
                isAuth={isAuth}
                handleShowModal={handleShowModal}
                displayPhoto={displayPhoto}
                friendDisplayPhoto={friendDisplayPhoto}
                friendUsername={friendUsername}
                ref={ref} />
            </MessagesContainerWrapper>
            <MessagesTextareaWrapper className="d-flex flex-column">
                <ContainerWrapper className="d-flex" css={{ 
                    overflowX: 'auto', 
                    maxWidth: '800px',
                    padding: '$space-2',
                    '> div': {
                        padding: '$space-2', 
                        background: '$lightGray1',
                        borderRadius: '$small',
                    },
                    '> div:nth-child(n+2)': {
                        marginLeft: '$space-3',
                    },
                }}>
                {
                    (imageUrls && (Object.keys(imageUrls).length > 0)) &&
                    Object.keys(imageUrls).map((i, val) => {
                        return (
                            <ImageWrapper key={i} className="d-flex flex-column">
                                <Image src={Object.values(imageUrls)[val].src} css={{
                                    width: '70px',
                                    height: '70px',
                                    objectFit: 'cover',
                                    borderRadius: '$small',
                                }} />
                                <Button
                                type="button"
                                text={<FontAwesomeIcon icon={faTrash} className="fa-fw fa-lg" />}
                                className="button-plain-red align-self-end"
                                color="transparent"
                                css={{
                                    position: 'absolute',
                                    marginTop: '-25px',
                                    marginRight: '-35px',
                                }}
                                onClick={() => handleRemoveImage(Object.values(imageUrls)[val].name)} />
                            </ImageWrapper>
                        )
                    })
                }
                </ContainerWrapper>
                <ContainerWrapper className="d-flex flex-column flex-sm-row">
                    <ContainerWrapper className="d-flex flex-row flex-sm-column align-items-center">
                        <ContainerWrapper>
                            <Text
                            type="span"
                            color="darkGray"
                            className="emoji-toggler"
                            onClick={() => handleToggleEmoji()}><FontAwesomeIcon icon={faFaceSmile} className="fa-fw fa-xl" /></Text>
                        </ContainerWrapper>
                        <ContainerWrapper css={{ 
                            margin: '$space-2 0px 0px',
                            '@media screen and (max-width: 575px)': {
                                margin: '0px 0px 0px $space-2',
                            },
                        }}>
                            <input
                            id="images"
                            name="image"
                            type="file"
                            accept="image/*"
                            hidden
                            multiple
                            onChange={evt => handleImageChange(evt)} />
                        {
                            <LabelWrapper htmlFor="images" className="d-flex flex-column justify-content-evenly align-items-center">
                                <FontAwesomeIcon icon={faImages} className="fa-fw fa-xl" />
                            </LabelWrapper>
                        }
                        </ContainerWrapper>
                    </ContainerWrapper>
                    <PostMessage
                    storeFn={storeFn}
                    ref={emojiRef}
                    onEmojiClick={onEmojiClick}
                    isEmojiShown={isEmojiShown}
                    className="flex-grow-1"
                    isAuth={isAuth}
                    form={form}
                    handleImageChange={handleImageChange}
                    imageUrls={imageUrls}
                    css={{
                        height: '15vh',
                        margin: '0px 0px 0px $space-2',
                        '@media screen and (max-width: 575px)': {
                            margin: '0px',
                        },
                    }} />
                </ContainerWrapper>
            </MessagesTextareaWrapper>
        </MessagesMainWrapper>
    )
});

export default MessagesMain;