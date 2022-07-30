import { 
    useState, 
    useEffect,
    useRef,
} from "react";
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
    onSnapshot,
    arrayUnion,
    arrayRemove,
    getDoc,
    getDocs,
    where,
} from "firebase/firestore";
import { 
    auth, 
    db,
    storage,
} from "../../../util/Firebase";
import { styled } from "../../../stitches.config";
import { 
    ref, 
    uploadBytes,
    getDownloadURL,
    listAll,
} from "firebase/storage";
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
    displayPhoto,
}) => {
    const messagesRef = useRef('');
    const [form] = Form.useForm();
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedChat, setSelectedChat] = useState('');
    const [files, setFiles] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [forceRender, setForceRender] = useState(false);
    const [previousId, setPreviousId] = useState('');

    const handleForceRender = () => setForceRender(!(forceRender));
    const handleImageUrls = imageUrls => setImageUrls(imageUrls);
    const handleFiles = files => setFiles(files);
    const handleSelectedUser = selectedUser => setSelectedUser(selectedUser);
    const handleSelectedChat = selectedChat => setSelectedChat(selectedChat);
    const handlePreviousId = previousId => setPreviousId(previousId);

    const getPreviousMessageId = async(id) => {
        handlePreviousId(id);
    }

    const onStore = values => {
        if (!(isAuth && selectedChat && (Object.keys(selectedChat).length > 0) && (Object.keys(selectedChat.user.user).length > 0)) && (!(auth) || !(db) || !(storage))) {
            console.error('on message store: no cookies');
            return;
        }

        if (auth.currentUser.uid) {
            const storeForm = new FormData();

            for (let i in values) {
                values[i] && storeForm.append(i, values[i]);
            }

            const id = (auth.currentUser.uid < selectedChat.user.user.uid) ? auth.currentUser.uid + "-" + selectedChat.user.user.uid : selectedChat.user.user.uid + "-" + auth.currentUser.uid;

            //set ID to sender - receiver of the message
            addDoc(collection(db, "messages", id, "messages"), {
                message: values.message,
                sender: auth.currentUser.uid,
                recipient: selectedChat.user.user.uid,
                created_at: Timestamp.fromDate(new Date()),
                read_at: '',
                images: '',
                is_read: false,
            }).then(response => {
                if (files && (Object.keys(files).length > 0)) {
                    let ctr = 0;

                    for (let i of files) {
                        ++ctr;

                        const storageRef = ref(storage, id + '/' + ctr + '-' + i.name);

                        uploadBytes(storageRef, i).then((snapshot) => {
                            getDownloadURL(ref(storage, snapshot.ref.fullPath)).then((downloadURL) => {
                                console.log('File available at', downloadURL);
                                const imagesRef = doc(db, "messages", id, "messages", response.id);

                                updateDoc(imagesRef, {
                                    images: arrayUnion(downloadURL)
                                });
                            });
                        });
                    }
                }
            })

            .catch(error => {
                console.error('err ', error);
            });

            handleFiles('');
            handleImageUrls('');

            setDoc(doc(db, "lastMessages", id), {
                message: values.message,
                sender: auth.currentUser.uid,
                recipient: selectedChat.user.user.uid,
            })

            form.resetFields();
        }
    }

    const onSelect = selected => {
        if (!(isAuth) && (!(auth.currentUser) || !(db))) {
            console.error('err on select: no firebase cred');
            return;
        }

        const id = (auth.currentUser.uid < selected.user.uid) ? auth.currentUser.uid + "-" + selected.user.uid : selected.user.uid + "-" + auth.currentUser.uid;

        // Create message meta(to check if message is open, etc) if it does not exist yet
        const meta = doc(db, "messagesMeta", id);

        getDoc(meta).then(response => {
            if (!(response.exists())) {
                console.info('no doc');

                setDoc(doc(db, "messagesMeta", id), {
                    viewers: arrayUnion(auth.currentUser.uid),
                }).then(createResponse => {
                    console.info('created meta ', createResponse);
                })

                .catch(errCreateResponse => {
                    console.error('err create ', errCreateResponse);
                });
            } else {
                addMessageViewer(id, auth.currentUser.uid);
            }
        });

        // Update if user is viewing the messages
        if (previousId) {
            if (previousId !== id) {
                removeMessageViewer(previousId, auth.currentUser.uid);
            }

            addMessageViewer(id, auth.currentUser.uid);
        }

        handleSelectedUser(selected);
    }

    const handleImageChange = evt => {
        console.info('evt ', evt.target.files);
        if (evt.target.files.length > 0) {
            if (evt.target.files.length > 10) {
                console.log("too many");
                return;
            }

            for (let i of evt.target.files) {
                if (i.size > (2 * 1024 * 1024)) {
                    console.log("too large ");
                    return;
                }
            }

            handleFiles(evt.target.files);
            handleForceRender();
        }
    }

    const handleRemoveImage = name => {
        handleFiles(Object.values(files).filter(file => file.name !== name));
        handleImageUrls(Object.values(imageUrls).filter(imageUrl => imageUrl.name !== name));
    }

    useEffect(() => {
        return () => {
            if (auth && db && auth.currentUser && storage) {
                // Remove authenticated user as a viewer when leaving messages
                const messagesMetaRef = collection(db, "messagesMeta");

                const q = query(messagesMetaRef, where("viewers", "array-contains", auth.currentUser.uid));

                getDocs(q).then(response => {
                    response.forEach(messageMeta => {
                        removeMessageViewer(messageMeta.id, auth.currentUser.uid);
                    });
                });
            }
        }
    }, []);  

    useEffect(() => {
        let loading = true;
        let array = [];

        if (loading && (Object.keys(files).length > 0)) {
            for (let i of files) {
                console.log(i);
                array.push({ src: URL.createObjectURL(i), name: i.name });
            }

            console.log('arra ', array);
            handleImageUrls(array);
        }

        return () => {
            if (array.length > 0) {
                for (let i of array) {
                    URL.revokeObjectURL(i);
                }
            }

            loading = false;
        }
    }, [forceRender]);

    useEffect(() => {
        let loading = true;

        if (!(auth.currentUser && db && selectedUser && (Object.keys(selectedUser).length > 0) && (Object.keys(selectedUser.user).length > 0))) {
            console.error("on update meta: firebase error");
            return;
        }

        const id = (auth.currentUser.uid < selectedUser.user.uid) ? auth.currentUser.uid + "-" + selectedUser.user.uid : selectedUser.user.uid + "-" + auth.currentUser.uid;
        let unsubscribe;

        if (loading) {
            const messagesRef = collection(db, "messages", id, "messages");
            const result = query(messagesRef, orderBy("created_at", "asc"));

            unsubscribe = onSnapshot(result, querySnapshot => {
                let z = [];
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log('chats ', doc.data());
                    z.push(doc.data());
                    markAsRead(id, auth.currentUser.uid);
                })

                handleSelectedChat({
                    user: selectedUser,
                    messages: z,
                });
            });

            getPreviousMessageId(id);
        }

        return () => {
            unsubscribe();
            loading = false;
        }
    }, [selectedUser]);

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
                            imageUrls: imageUrls,
                            handleImageChange: handleImageChange,
                            handleRemoveImage: handleRemoveImage,
                            displayPhoto: displayPhoto,
                            messagesRef: messagesRef,
                        }} />
                    </Column>
                </Row>
            </MessagesWrapper>
        </Section>
    )
}

function markAsRead(id, authId) {
    const messagesRef = collection(db, "messages", id, "messages");

    const q = query(messagesRef, where("is_read", "==", false), where("recipient", "==", authId), orderBy("created_at", "asc"));

    getDocs(q).then(response => {
        response.forEach(message => {
            // doc.data() is never undefined for query doc snapshots
            const messageRef = doc(db, "messages", id, "messages", message.id);
            updateDoc(messageRef, {
                is_read: true,
                read_at: Timestamp.fromDate(new Date()),
            }).then(() => {
                console.info('doc id ', message.id + " updated");
            })
        });
    });
}

function addMessageViewer(id, value) {
    const meta = doc(db, "messagesMeta", id);

    getDoc(meta).then(response => {
        if (response.exists()) {
            updateDoc(doc(db, "messagesMeta", id), {
                viewers: arrayUnion(value),
            }).then(response => {
                console.info('updated meta ', response);
            })

            .catch(error => {
                console.error('err add', error);
            });
        }
    });

    return;
}

function removeMessageViewer(id, value) {
    const meta = doc(db, "messagesMeta", id);

    getDoc(meta).then(response => {
        if (response.exists()) {
            updateDoc(doc(db, "messagesMeta", id), {
                viewers: arrayRemove(value),
            }).then(response => {
                console.info('updated meta ', response);
            })

            .catch(error => {
                console.error('err remove ', error);
            });
        }
    });

    return;
}

export default Messages;