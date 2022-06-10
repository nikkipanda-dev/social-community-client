import { useState, useEffect, } from "react";
import { 
    doc, 
    onSnapshot,
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { auth, db, } from "../../../util/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { styled } from "../../../stitches.config";

import Image from "../../core/Image";
import Text from "../../core/Text";

const MessagesUserCardWrapper = styled('div', {
    '> div': {
        background: '$white',
        padding: '$space-3 $space-2',
        transition: '$default',
    },
    'img': {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
    },
    '> div:hover': {
        cursor: 'pointer',
        background: '$lightGray',
    },
});

const ContentWrapper = styled('div', {});

const MiscWrapper = styled('div', {
    marginLeft: '$space-2',
    display: 'block',
    '@media screen and (max-width: 767px)': {
        display: 'none',
    },
});

const NotificationWrapper = styled('div', {
    marginLeft: '0',
    '@media screen and (max-width: 767px)': {
        marginLeft: '$space-2',
    },
});

export const MessagesUserCard = ({ 
    values, 
    onSelect,
}) => {
    // console.log('vakues ', values);

    const [lastMessage, setLastMessage] = useState();
    const [displayPhoto, setDisplayPhoto] = useState();
    const [unreadCount, setUnreadCount] = useState();

    const handleLastMessage = lastMessage => setLastMessage(lastMessage);
    const handleDisplayPhoto = displayPhoto => setDisplayPhoto(displayPhoto);
    const handleUnreadCount = unreadCount => setUnreadCount(unreadCount);

    useEffect(() => {
        let loading = true;
        let unsubscribe;

        if (loading && auth && auth.currentUser) {
            const id = (auth.currentUser.uid < values.uid) ? auth.currentUser.uid + "-" + values.uid : values.uid + "-" + auth.currentUser.uid;

            const docRef = doc(db, "lastMessages", id);
            let lastMessage = [];

            onSnapshot(docRef, doc => {
                // console.log("CURRENT DATA: ", doc.data());
                lastMessage.push(doc.data());
                if (doc.exists()) {
                    handleLastMessage(doc.data());
                } else {
                    console.log("CURRENT DATA: NONE"); 
                }
            });

            getDisplayPhoto(values.username).then(response => {
                if (response.data.isSuccess) {
                    handleDisplayPhoto(response.data.data.details);
                }
            })

            .catch (err => {
                console.error('err ', err);
            });

            unsubscribe = onSnapshot(getUnreadMessages(id, auth.currentUser.uid), doc => {
                let z = [];
                doc.forEach(message => {
                    // doc.data() is never undefined for query doc snapshots
                    z.push(message.data());
                });

                z.length > 0 ? handleUnreadCount(z.length) : handleUnreadCount(''); 
            });
        }

        return () => {
            unsubscribe();
            loading = false;
        }
    }, []);

    return (
        (values && (Object.keys(values).length > 0)) && 
        <MessagesUserCardWrapper onClick={() => onSelect(values)}>
            <ContentWrapper className="d-flex align-items-start" css={{ 
                'img' : {
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '100%',
                },
            }}>
                <Image src={displayPhoto ? displayPhoto : "/avatar_medium.png"} />
                <ContentWrapper className="d-flex flex-column flex-grow-1">
                    <ContentWrapper className="d-flex justify-content-end justify-content-md-between flex-grow-1">
                        <MiscWrapper>
                            <Text type="span">{values.first_name + " " + values.last_name}</Text><br />
                            <Text type="span" color="darkGray">{"@" + values.username}</Text>
                        </MiscWrapper>
                        <NotificationWrapper>
                            <Text type="span" css={{
                                color: '$orangeRedCrayola',
                                fontWeight: 'bold',
                                maxWidth: 'max-content',
                                padding: '$space-2 $space-2 $space-1',
                            }}>{unreadCount}</Text>
                            <Text type="span" color={values.isOnline ? "green" : "lightGray2"}>
                                <FontAwesomeIcon icon={faCircle} className="fa-fw fa-xs ms-2" />
                            </Text>
                        </NotificationWrapper>
                    </ContentWrapper>
                    {
                        (lastMessage && (Object.keys(lastMessage).length > 0)) &&
                        <ContentWrapper className="d-flex justify-content-end justify-content-md-between flex-grow-1">
                            <MiscWrapper>
                                <Text type="span">{lastMessage.message}</Text>
                            </MiscWrapper>
                        </ContentWrapper>
                    }
                </ContentWrapper>
            </ContentWrapper>
        </MessagesUserCardWrapper>
    )
}

async function getDisplayPhoto(username) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "user/display-photo/get", {
        params: {
            username: username,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function getUnreadMessages(id, userId) {
    const messagesMetaRef = collection(db, "messages", id, "messages");

    const q = query(messagesMetaRef, where("isRead", "==", false), where("sender", "!=", userId));

    return q;
}

export default MessagesUserCard;