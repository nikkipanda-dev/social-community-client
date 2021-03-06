import { useState, useEffect, } from "react";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { 
    collection, 
    query,
    where, 
    onSnapshot,
} from "firebase/firestore";
import { auth, db, } from "../../../util/Firebase";
import { styled } from "../../../stitches.config";

import MessagesUsers from "../MessagesUsers";

const HeaderWrapper = styled('div', {
    height: '10vh',
});

const MessagesSidebarWrapper = styled('div', {
    height: '65vh',
    overflow: 'auto',
    overflowX: 'hidden',
});

export const MessagesSidebar = ({ 
    isAuth,
    onSelect,
}) => {
    const [users, setUsers] = useState('');

    const handleUsers = users => setUsers(users);

    useEffect(() => {
        let loading = true;

        if (loading && isAuth && auth && db) {
            getFriends(JSON.parse(Cookies.get('auth_user')).username).then(response => {
                if (!(response.data.isSuccess)) {
                    console.error('err res ', response.data.data.errorText);
                    return;
                }

                if (Object.keys(response.data.data.details).length > 0) {
                    let u = [];
                    Object.keys(response.data.data.details).map((_, val) => u.push(Object.values(response.data.data.details)[val].username));

                    const usersRef = collection(db, "users");
                    const result = query(usersRef, where('username', "in", u));

                    onSnapshot(result, querySnapshot => {
                        let z = [];
                        let c = [];

                        querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                            // console.log('doc ', doc.data());
                            z.push(doc.data());
                        })

                        for (let i of response.data.data.details) {
                            for (let b of z) {
                                (i.username === b.username) && c.push({
                                    user: b,
                                    display_photo: i.display_photo,
                                });
                            }
                        }

                        handleUsers(c);
                    })
                }
            })

            .catch(err => {
                console.error('err ', err);
            });
        } 

        return () => {
            loading = false;
        }
    }, []);
    
    return (
        <MessagesSidebarWrapper>
            <HeaderWrapper>
                header nav
            </HeaderWrapper>
            <MessagesUsers 
            users={users} 
            onSelect={onSelect} />
        </MessagesSidebarWrapper>
    )
}

function getFriends(username) {
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

export default MessagesSidebar;