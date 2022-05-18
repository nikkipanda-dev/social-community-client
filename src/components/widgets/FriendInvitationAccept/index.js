import { useParams } from 'react-router-dom';
import { useState, useEffect, } from 'react';
import { axiosInstance } from '../../../requests';
import { isAuth, key, showAlert, } from '../../../util';
import Cookies from 'js-cookie';
import { message, Form, Menu, Dropdown, } from 'antd';
import { styled } from "../../../stitches.config";

import Alert from '../../core/Alert';
import Text from '../../core/Text';
import Button from '../../core/Button';

const InvitationAcceptWrapper = styled('div', {});

const SubmitButtonWrapper = styled('div', {
    marginTop: '30px',
});

export const InvitationAccept = ({ 
    member, 
    handleHideModal,
    removeFriend,
    handleFriendStatus,
}) => {
    const params = useParams();

    const [isAccepted, setIsAccepted] = useState(false);
    const [status, setSatus] = useState('');
    const [help, setHelp] = useState('');

    const handleIsAccept = () => setIsAccepted(true);
    const handleStatus = status => setSatus(status);
    const handleHelp = help => setHelp(help);

    const acceptFriendInvitation = () => {
        const acceptInvitationForm = new FormData();

        if (isAuth() && (member && member.username)) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            acceptInvitationForm.append('auth_username', JSON.parse(Cookies.get('auth_user')).username);
            acceptInvitationForm.append('username', params.username);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "friends/user/accept", acceptInvitationForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                console.log('res ', response.data);
                if (response.data.isSuccess) {
                    handleIsAccept();
                    handleFriendStatus(response.data.data.details);
                    handleStatus("success");
                    handleHelp("Friend invitation from @" + member.username + " accepted.");
                    
                    setTimeout(() => {
                        handleHideModal();
                    }, 2000);
                } else {
                    showAlert();
                    setTimeout(() => {
                        message.info({
                            content: <Text type="span">{response.data.data.errorText}</Text>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25h',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response.data.errors : err);
                // if (err.response && err.response.data.errors && err.response.data.errors.body) {
                //     setHelp(<Text type="span" color="red">{err.response.data.errors.body[0]}</Text>);
                // }
            });
        } else {
            console.log('on friend invitation accept widget: no cookies');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading && (member && member.username)) {
            handleHelp("Accept @" + member.username + ((member.username.charAt(member.username.length - 1).toLowerCase() === 's') ? "'" : "'s") + " friend invitation?");
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <InvitationAcceptWrapper>
            <Alert 
            status={status}
            icon 
            header="Friend Invitation">
                <Text type="span">{help}</Text>
            </Alert>
            <SubmitButtonWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                <Button
                type="button"
                text="Decline"
                color="red"
                className="flex-grow-1 flex-sm-grow-0"
                onClick={() => removeFriend()} />
                <Button
                type="button"
                text="Accept"
                color="brown"
                className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                onClick={() => acceptFriendInvitation()} />
            </SubmitButtonWrapper>
        </InvitationAcceptWrapper>
    )
}

export default InvitationAccept;