import { useState, useEffect, } from "react";
import { Form, Input } from "antd";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { useOutletContext, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";
import MessagesMain from "../../widgets/MessagesMain";
import MessagesInfo from "../../widgets/MessagesInfo";

const MessagesWrapper = styled('div', {});

const ContentWrapper = styled('div', {});

const SubmitButtonWrapper = styled('div', {
    marginTop: '30px',
});

const validateMessages = {
    required: '${label} is required.',
    string: {
        range: "${label} must be at least ${min} and maximum of ${max} characters.",
    }
};

export const Messages = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [projectId, setProjectId] = useState('');
    const [user, setUser] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState('');
    const [messages, setMessages] = useState('');
    const context = useOutletContext();

    console.info('context ', context);

    const handleMessages = messages => setMessages(messages);
    const handleShowLoading = () => setLoading(true);
    const handleUser = user => setUser(user);
    const handleSecret = secret => setSecret(secret);
    const handleHideLoading = () => setLoading(false);
    const handleProjectId = projectId => setProjectId(projectId);
    const handleKey = key => setKey(key);

    return (
        <MessagesWrapper className="d-flex flex-column flex-lg-row">
            <ContentWrapper css={{ flex: '65%', }}>
                <MessagesMain 
                storeFn={context.storeFn} 
                isAuth={context.isAuth}
                form={context.form}
                firebase={context.firebase}
                messages={context.selectedChat.messages} />
            </ContentWrapper>
            <ContentWrapper css={{ flex: '35%', }}>
                <MessagesInfo values={context.selectedChat} />
            </ContentWrapper>
        </MessagesWrapper>
    )
}

export default Messages;