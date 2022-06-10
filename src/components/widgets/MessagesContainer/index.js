import { 
    useState, 
    useEffect,
    forwardRef,
} from "react";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { 
    updateDoc, 
    getDocs,
    collection,
    doc,
    query,
    where,
    Timestamp,
} from "firebase/firestore";
import { auth, db, } from "../../../util/Firebase";
import { styled } from "../../../stitches.config";

import MessageBubble from "../MessageBubble";

const MessagesContainerWrapper = styled('div', {
    padding: '$space-3',
    width: '100%',
    height: '60vh',
    overflow: 'auto',
    overflowX: 'hidden',
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
    },
});

export const MessagesContainer = forwardRef(({ 
    messages, 
    isAuth,
    displayPhoto,
    friendUsername,
    friendId,
}, ref) => {
    console.info('friendUsername ', friendUsername);

    const [friendDisplayPhoto, setFriendDisplayPhoto] = useState('');

    const handleFriendDisplayPhoto = friendDisplayPhoto => setFriendDisplayPhoto(friendDisplayPhoto);

    useEffect(() => {
        let loading = true;

        if (loading && messages && (Object.keys(messages).length > 0) && friendId && auth.currentUser) {
            setTimeout(() => {
                const id = (auth.currentUser.uid < friendId) ? auth.currentUser.uid + "-" + friendId : friendId + "-" + auth.currentUser.uid;

                const unreadMessagesRef = collection(db, "messages", id, "messages");
                const q = query(unreadMessagesRef, where("isRead", "==", false));

                getDocs(q).then(res => {
                    res.forEach(unreadMessage => {
                        // doc.data() is never undefined for query doc snapshots
                        const unreadMessageRef = doc(db, "messages", id, "messages", unreadMessage.id);
                        updateDoc(unreadMessageRef, {
                            isRead: true,
                            readAt: Timestamp.fromDate(new Date()),
                        }).then(updateRes => {
                            console.info('updated');
                        });
                    })
                })
            }, 1000);
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;

        if (loading && isAuth && friendUsername) {
            getFriendDisplayPhoto(friendUsername).then(response => {
                if (response.data.isSuccess) {
                    handleFriendDisplayPhoto(response.data.data.details);
                }
            })

            .catch(err => {
                console.error('err ', err);
            });
        }

        return () => {
            loading = false;
      }
    }, [friendUsername]);

    return (
        <MessagesContainerWrapper className="d-flex flex-column bg-light" ref={ref}>
        {
            (messages && (Object.keys(messages).length > 0)) && 
            Object.keys(messages).map((_, val) => <MessageBubble 
            key={Object.values(messages)[val].created_at.seconds} 
            values={Object.values(messages)[val]}
            displayPhoto={displayPhoto}
            friendDisplayPhoto={friendDisplayPhoto}
            isAuth={isAuth} />)
        }
        </MessagesContainerWrapper>
    )
});

async function getFriendDisplayPhoto(username) {
    console.info('use ', username);
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

export default MessagesContainer;