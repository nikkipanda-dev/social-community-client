import { useState, useEffect, } from "react";
import { Form, Input } from "antd";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { useOutletContext, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import MessagesMain from "../../widgets/MessagesMain";
import MessagesInfo from "../../widgets/MessagesInfo";

const MessagesWrapper = styled('div', {});

const ContentWrapper = styled('div', {});

export const Messages = () => {
    const context = useOutletContext();

    return (
        <MessagesWrapper className="d-flex flex-column flex-lg-row">
            <ContentWrapper css={{ flex: '65%', }}>
                <MessagesMain 
                storeFn={context.storeFn} 
                isAuth={context.isAuth}
                form={context.form}
                friendUsername={context.selectedChat ? context.selectedChat.user.username : ''}
                friendId={context.selectedChat ? context.selectedChat.uid : ''}
                messages={context.selectedChat.messages}
                imageUrls={context.imageUrls}
                handleImageChange={context.handleImageChange}
                handleRemoveImage={context.handleRemoveImage}
                displayPhoto={context.displayPhoto}
                ref={context.messagesRef} />
            </ContentWrapper>
            <ContentWrapper css={{ flex: '35%', }}>
                <MessagesInfo values={context.selectedChat} />
            </ContentWrapper>
        </MessagesWrapper>
    )
}

export default Messages;