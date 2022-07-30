import { useState, } from "react";
import { useOutletContext, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import MessagesMain from "../../widgets/MessagesMain";
import MessagesInfo from "../../widgets/MessagesInfo";
import Modal from "../../widgets/Modal";
import Image from "../../core/Image";

const MessagesWrapper = styled('div', {});

const ContentWrapper = styled('div', {});

export const Messages = () => {
    const context = useOutletContext();
    let z = [];

    if (context.selectedChat && (Object.keys(context.selectedChat.messages).length > 0)) {
        Object.values(context.selectedChat.messages).map((_, val) => z.push(Object.values(context.selectedChat.messages)[val].images));
    }

    const [isVisible, setIsVisible] = useState(false);
    const [image, setImage] = useState('');

    const handleImage = image => setImage(image);

    const handleShowModal = value => {
        handleImage(value);
        setIsVisible(true);
    };

    const handleHideModal = () => setIsVisible(false);

    return (
        <MessagesWrapper className="d-flex flex-column flex-lg-row">
            <ContentWrapper css={{ flex: '65%', }}>
                <MessagesMain 
                storeFn={context.storeFn} 
                isAuth={context.isAuth}
                form={context.form}
                handleShowModal={handleShowModal}
                friendDisplayPhoto={context.selectedChat && context.selectedChat.user && context.selectedChat.user.display_photo}
                friendUsername={context.selectedChat ? context.selectedChat.user.username : ''}
                messages={context.selectedChat && context.selectedChat.messages}
                imageUrls={context.imageUrls}
                handleImageChange={context.handleImageChange}
                handleRemoveImage={context.handleRemoveImage}
                displayPhoto={context.displayPhoto}
                ref={context.messagesRef} />
            </ContentWrapper>
            <ContentWrapper css={{ flex: '35%', }}>
                <MessagesInfo 
                values={context.selectedChat && context.selectedChat.user} 
                messageImages={z}
                handleShowModal={handleShowModal} />
            </ContentWrapper>
            <Modal
            isVisible={isVisible}
            closable={false}
            width="1000px"
            maskClosable={true}
            bodyStyle={{ 
                height: '90vh',
                overflow: 'auto',
                padding: '$space-2',
            }}
            onCancel={handleHideModal}>
                <ContentWrapper className="d-flex justify-content-center align-items-center">
                    <Image src={image} css={{ maxWidth: '700px', height: 'auto' }} />
                </ContentWrapper>
            </Modal>
        </MessagesWrapper>
    )
}

export default Messages;