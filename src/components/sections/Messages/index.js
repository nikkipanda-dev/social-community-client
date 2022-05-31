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

    const handleMessages = messages => setMessages(messages);
    const handleShowLoading = () => setLoading(true);
    const handleUser = user => setUser(user);
    const handleSecret = secret => setSecret(secret);
    const handleHideLoading = () => setLoading(false);
    const handleProjectId = projectId => setProjectId(projectId);
    const handleKey = key => setKey(key);

    const onFinish = values => {
        console.log('val ', values);

        if (!(context.isAuth)) {
            console.error('on message store: no cookies');
            return;
        }

        const storeForm = new FormData();

        for (let i in values) {
            values[i] && storeForm.append(i, values[i]);
        }

        // storeForm.append('username', JSON.parse(Cookies.get('auth_user')).username)

        // storeMessage(storeForm).then(response => {
        //     console.info('res ', response.data);
        // })

        // .catch (err => {
        //     console.log('err ', err.response && err.response.data.errors);
        // })
    }

    return (
        <MessagesWrapper className="d-flex flex-column flex-lg-row">
            <ContentWrapper css={{ flex: '65%', }}>
                <MessagesMain storeFn={onFinish} isAuth={context.isAuth} />
            </ContentWrapper>
            <ContentWrapper css={{ flex: '35%', }}>
                <MessagesInfo />
            </ContentWrapper>
        </MessagesWrapper>
    )
}

async function storeMessage(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "test", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

// function createChatEngineUser(form, key) {
//     return axiosInstance.post(process.env.REACT_APP_CHATENGINE_BASE_URL + "users/", form, {
//         headers: {
//             "private-key": key,
//         }
//     })
// }

export default Messages;