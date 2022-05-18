import { useState, useEffect, } from "react";
import Cookies from 'js-cookie';
import { isAuth, } from "../../../util";
import { axiosInstance } from "../../../requests";
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import Image from "../../core/Image";
import Text from "../../core/Text";
import Button from "../../core/Button";

const FriendInvitationWrapper = styled('div', {});

const FriendInvitationBodyWrapper = styled('div', {});

const ActionWrapper = styled('div', {});

export const FriendInvitation = ({ invitation, }) => {
    console.log('invi ', invitation);

    const [values, setValues] = useState('');

    const handleValues = values => setValues(values);

    const acceptInvitation = () => {
        if (isAuth() && (values && values.username)) {
            const acceptInvitationForm = new FormData();

            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            acceptInvitationForm.append('auth_username', JSON.parse(Cookies.get('auth_user')).username);
            acceptInvitationForm.append('username', values.username);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "friends/user/accept", acceptInvitationForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                console.log('res ', response.data);
                // if (response.data.isSuccess) {
                //     handleMicroblogEntriesLen(Object.keys(response.data.data.details).length);
                //     handleMicroblogEntries(response.data.data.details.slice(0, 10));
                //     (Object.keys(response.data.data.details).length > 10) ? handlePageCount(Math.ceil(Object.keys(response.data.data.details).length / 10)) : handlePageCount(1);
                // } else {
                //     console.log(response.data.data.errorText);
                // }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err friends', err.response.data.errors);
                }
            });
        } else {
            console.log('on friends accept: no cookies');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading && (invitation && (Object.keys(invitation).length > 0))) {
            handleValues(invitation);
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <FriendInvitationWrapper className="bg-secondary p-1">
            <Card className="bg-warning p-1">
                <FriendInvitationBodyWrapper className="bg-primary d-flex flex-column align-items-center">
                    <Image src="/avatar_medium.png" className="bg-danger" css={{
                        width: '100%',
                        maxWidth: '100px',
                        height: 'auto',
                    }} />
                    <Text type="span" size="medium">{values && (values.first_name && values.last_name) && (values.first_name + ' ' +  values.last_name)}</Text>
                    <Text type="span" size="medium">{values && (values.username) && ('@' + values.username)}</Text>
                    <ActionWrapper>
                        <Button 
                        type="button" 
                        text="Accept"
                        onClick={() => acceptInvitation()} />
                        <Button type="button" text="Decline" />
                    </ActionWrapper>
                </FriendInvitationBodyWrapper>
            </Card>
        </FriendInvitationWrapper>
    )
}

export default FriendInvitation;