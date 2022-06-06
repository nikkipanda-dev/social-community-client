import { useState, useEffect, } from "react";
import { Outlet, } from "react-router-dom";
import Cookies from 'js-cookie';
import { Form, } from "antd";
import { axiosInstance } from "../../../requests";
import { 
    doc, 
    setDoc,
    updateDoc, 
    addDoc, 
    collection,
    Timestamp,
    query,
    orderBy,
    limit,
    onSnapshot,
} from "firebase/firestore";
import { auth, db, } from "../../../util/Firebase";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import MessagesSidebar from "../../widgets/MessagesSidebar";

const MessagesWrapper = styled('div', {
    maxWidth: '1700px',
    paddingTop: '$space-5',
});

export const Messages = ({ 
    isAuth, 
}) => {
    const [form] = Form.useForm();
    const [selectedChat, setSelectedChat] = useState('');

    const handleSelectedChat = selectedChat => setSelectedChat(selectedChat);

    const onStore = values => {
        console.log('val ', values);

        if (!(isAuth) && (!(auth) || !(db))) {
            console.error('on message store: no cookies');
            return;
        }

        if (selectedChat && (Object.keys(selectedChat).length > 0) && auth && auth.currentUser.uid) {
            console.info('valid');
            const storeForm = new FormData();

            for (let i in values) {
                values[i] && storeForm.append(i, values[i]);
            }

            const id = (auth.currentUser.uid < selectedChat.user.uid) ? auth.currentUser.uid + "-" + selectedChat.user.uid : selectedChat.user.uid + "-" + auth.currentUser.uid;

            //set ID to sender - receiver of the message
            addDoc(collection(db, "messages", id, "messages"), {
                message: values.message,
                sender: auth.currentUser.uid,
                recipient: selectedChat.user.uid,
                created_at: Timestamp.fromDate(new Date()),
                readAt: '',
                isRead: false,
            });

            setDoc(doc(db, "lastMessages", id), {
                message: values.message,
                sender: auth.currentUser.uid,
                recipient: selectedChat.user.uid,
            });

            form.resetFields();
        }
    }

    const onSelect = selected => {
        console.info('selected ', selected);

        if (!(isAuth) && (!(auth.currentUser) || !(db))) {
            console.error('err on select: no firebase cred');
            return;
        }

        const messagesRef = collection(db, "messages", (auth.currentUser.uid < selected.uid) ? auth.currentUser.uid + "-" + selected.uid : selected.uid + "-" + auth.currentUser.uid, "messages");
        const result = query(messagesRef, orderBy('created_at', "asc"));

        onSnapshot(result, querySnapshot => {
            let z = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log('chats ', doc.data());
                z.push(doc.data());
            })

            handleSelectedChat({
                user: selected,
                messages: z,
            });
        });
    }
    
    return (
        <Section>
            <MessagesWrapper className="mx-auto">
                <Row className="g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-sm-3">
                        <MessagesSidebar 
                        isAuth={isAuth} 
                        onSelect={onSelect} />
                    </Column>
                    <Column className="col-sm-9">
                        <Outlet context={{
                            isAuth: isAuth,
                            selectedChat: selectedChat,
                            storeFn: onStore,
                            form: form,
                        }} />
                    </Column>
                </Row>
            </MessagesWrapper>
        </Section>
    )
}

export default Messages;