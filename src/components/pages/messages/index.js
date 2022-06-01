import { useState, useEffect, } from "react";
import { Outlet, } from "react-router-dom";
import { getFirebaseValues, } from "../../../util/Firebase";
import Cookies from 'js-cookie';
import { Form, } from "antd";
import { axiosInstance } from "../../../requests";
import { 
    doc, 
    updateDoc, 
    addDoc, 
    collection,
    Timestamp,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";
import { signInWithEmailAndPassword, } from "firebase/auth";
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
    firebase,
    handleFirebase,
}) => {
    const [form] = Form.useForm();
    const [selectedChat, setSelectedChat] = useState('');
    const [firebaseVal, setFirebaseVal] = useState('');

    const handleFirebaseVal = firebaseVal => setFirebaseVal(firebaseVal);
    const handleSelectedChat = selectedChat => setSelectedChat(selectedChat);

    const onStore = values => {
        console.log('val ', values);

        if (!(isAuth)) {
            console.error('on message store: no cookies');
            return;
        }

        // console.log('selectedChat ', selectedChat);
        // console.log('firebase ', firebase);

        if (selectedChat && (Object.keys(selectedChat).length > 0) && firebase && (Object.keys(firebase).length > 0) && firebase[0].auth.currentUser.uid) {
            console.info('valid');
            const storeForm = new FormData();

            for (let i in values) {
                values[i] && storeForm.append(i, values[i]);
            }

            const db = firebase[0].db;

            //set ID to sender - receiver of the message
            addDoc(collection(db, "messages", (firebase[0].auth.currentUser.uid < selectedChat.user.uid) ? firebase[0].auth.currentUser.uid + "-" + selectedChat.user.uid : selectedChat.user.uid + "-" + firebase[0].auth.currentUser.uid, "messages"), {
                message: values.message,
                sender: firebase[0].auth.currentUser.uid,
                recipient: selectedChat.user.uid,
                created_at: Timestamp.fromDate(new Date()),
            });

            form.resetFields();
        }
    }

    const onSelect = selected => {
        console.info('selected ', selected);

        if (!(isAuth) && !(firebase) && (Object.keys(firebase).length === 0) && !(firebase[0].auth.currentUser)) {
            console.error('err on select: no firebase cred');
            return;
        }

        const db = firebase[0].db;
        const messagesRef = collection(db, "messages", (firebase[0].auth.currentUser.uid < selected.uid) ? firebase[0].auth.currentUser.uid + "-" + selected.uid : selected.uid + "-" + firebase[0].auth.currentUser.uid, "messages");
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
        })
    }

    useEffect(() => {
        let loading = true;

        if (loading && isAuth && !(firebase)) {
            const user = JSON.parse(Cookies.get('auth_user'));
            const secret = JSON.parse(Cookies.get('auth_user_firebase_secret'));
            const firebaseCred = JSON.parse(Cookies.get('auth_user_firebase'));

            handleFirebaseVal({
                firebase: getFirebaseValues({
                    apiKey: firebaseCred.api_key,
                    authDomain: firebaseCred.auth_domain,
                    databaseURL: firebaseCred.database_url,
                    projectId: firebaseCred.project_id,
                    storageBucket: firebaseCred.storage_bucket,
                    messagingSenderId: firebaseCred.messaging_sender_id,
                    appId: firebaseCred.app_id,
                }),
                user: user,
                secret: secret,
            });
        }

        return () => {
            loading = false;
        }
    }, []); 

    useEffect(() => {
        let loading = true;

        if (loading && isAuth && !(firebase) && !(firebase[0]) && firebaseVal && (Object.keys(firebaseVal).length > 0)) {
            signInWithEmailAndPassword(
                firebaseVal.firebase[0].auth,
                firebaseVal.user.email,
                firebaseVal.secret,
            )

            .then(response => {
                // console.info('res login ', response);
                const db = firebaseVal.firebase[0].db;
                updateDoc(doc(db, "users", response.user.uid), {
                    isOnline: true,
                });

                (firebaseVal.firebase) && handleFirebase(Object.values(firebaseVal.firebase));
            })

            .catch(err => {
                console.error('err ', err);
            });
        }

        return () => {
            loading = false;
        }
    }, [firebaseVal]);
    
    return (
        (firebase && (Object.keys(firebase).length > 0)) && 
        <Section>
            <MessagesWrapper className="mx-auto">
                <Row className="g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-sm-3">
                        <MessagesSidebar 
                        isAuth={isAuth} 
                        onSelect={onSelect}
                        firebase={firebase} />
                    </Column>
                    <Column className="col-sm-9">
                        <Outlet context={{
                            isAuth: isAuth,
                            firebase: firebase,
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

function getSelectedChat(username) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "friends/user/all", {
        params: {
            auth_username: username,
            username: username,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default Messages;