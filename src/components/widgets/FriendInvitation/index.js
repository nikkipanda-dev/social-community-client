import { useRef, } from "react";
import Cookies from 'js-cookie';
import { message, } from "antd";
import { isAuth, key, showAlert, } from "../../../util";
import { axiosInstance } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Column from "../../core/Column";
import Card from "../../core/Card";
import Image from "../../core/Image";
import Text from "../../core/Text";
import Button from "../../core/Button";

const FriendInvitationWrapper = styled('div', {
    '> div': {
        borderRadius: '$default',
        padding: '$space-4 $space-2',
    },
});

const FriendInvitationBodyWrapper = styled('div', {
    'img': {
        marginBottom: '$space-3',
    },
});

const ActionWrapper = styled('div', {
    width: '100%',
    marginTop: '$space-3',
});

export const FriendInvitation = ({ invitation, }) => {
    const ref = useRef();
    
    const acceptInvitation = () => {
        if (isAuth() && (invitation && invitation.username)) {
            const acceptInvitationForm = new FormData();

            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            acceptInvitationForm.append('auth_username', JSON.parse(Cookies.get('auth_user')).username);
            acceptInvitationForm.append('username', invitation.username);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "friends/user/accept", acceptInvitationForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    showAlert();
                    setTimeout(() => {
                        ref.current.remove();
                        message.open({
                            content: <>
                                <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="me-2"
                                style={{ color: '#007B70', }} />
                                <Text type="span">Accepted.</Text>
                            </>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
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
            console.log('on friends accept: no cookies');
        }
    }

    const declineMember = () => {
        if (isAuth() && (invitation && invitation.username)) {
            const declineMemberForm = new FormData();

            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            declineMemberForm.append('auth_username', JSON.parse(Cookies.get('auth_user')).username);
            declineMemberForm.append('username', invitation.username);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "friends/user/destroy", declineMemberForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    showAlert();
                    setTimeout(() => {
                        ref.current.remove();
                        message.open({
                            content: <>
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="me-2"
                                    style={{ color: '#007B70', }} />
                                <Text type="span">{response.data.data.details}</Text>
                            </>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err decline member', err.response.data.errors);
                }
            });
        } else {
            console.log('on profile decline member: no cookies');
        }
    }

    return (
        <Column ref={ref}>
            <FriendInvitationWrapper>
                <Card>
                    <FriendInvitationBodyWrapper className="d-flex flex-column align-items-center">
                        <Image src="/avatar_medium.png" css={{
                            width: '100%',
                            maxWidth: '100px',
                            height: 'auto',
                        }} />
                        <Text type="span" size="medium">{invitation && (invitation.first_name && invitation.last_name) && (invitation.first_name + ' ' + invitation.last_name)}</Text>
                        <Text type="span" size="medium">{invitation && (invitation.username) && ('@' + invitation.username)}</Text>
                        <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-evenly align-items-sm-center">
                            <Button
                            type="button"
                            text="Accept"
                            className="flex-grow-1 flex-sm-grow-0"
                            color="brown"
                            onClick={() => acceptInvitation()} />
                            <Button
                            type="button"
                            text="Decline"
                            className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                            color="red"
                            onClick={() => declineMember()} />
                        </ActionWrapper>
                    </FriendInvitationBodyWrapper>
                </Card>
            </FriendInvitationWrapper>
        </Column>
    )
}

export default FriendInvitation;