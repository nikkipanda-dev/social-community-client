import { useParams, } from "react-router-dom";
import { useState, useEffect, } from 'react';
import Cookies from 'js-cookie';
import { axiosInstance } from '../../../requests';
import { isAuth } from "../../../util";
import { styled } from "../../../stitches.config";

import FriendInvitation from "../FriendInvitation";

const FriendInvitationsWrapper = styled('div', {
    '> div': {
        width: '300px',
    },
});

export const FriendInvitations = () => {
    const params = useParams();

    const [invitations, setInvitations] = useState('');
    const [invitationsLen, setInvitationsLen] = useState(0);
    const [pageCount, setPageCount] = useState(1);

    const handleInvitations = invitations => setInvitations(invitations);
    const handleInvitationsLen = invitationsLen => setInvitationsLen(invitationsLen);
    const handlePageCount = pageCount => setPageCount(pageCount);

    const getInvitations = () => {
        if (isAuth()) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "friends/user/invitations", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                console.log('res invi', response.data);
                if (response.data.isSuccess) {
                    handleInvitationsLen(Object.keys(response.data.data.details).length);
                    handleInvitations(response.data.data.details.slice(0, 10));
                    (Object.keys(response.data.data.details).length > 10) ? handlePageCount(Math.ceil(Object.keys(response.data.data.details).length / 10)) : handlePageCount(1);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err friends', err.response.data.errors);
                }
            });
        } else {
            console.log('on friends invitations section: no cookies');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading) {
            getInvitations();
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <FriendInvitationsWrapper className="bg-warning d-flex align-items-center">
        {
            (invitations && (Object.keys(invitations).length > 0)) &&
            Object.keys(invitations).map((i, val) => {
                return <FriendInvitation key={i} invitation={Object.values(invitations)[val]} />
            })
        }
        </FriendInvitationsWrapper>
    )
}

export default FriendInvitations;