import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate, } from "react-router-dom";
import { isAuth, } from "../../../util";
import { Dropdown, Menu, } from "antd";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserMinus,
    faCaretUp,
    faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Column from "../../core/Column";
import Card from "../../core/Card";
import Image from "../../core/Image";
import Alert from "../../core/Alert";
import Text from "../../core/Text";
import Button from "../../core/Button";
import Modal from "../Modal";
import RemoveFriend from '../RemoveFriend';

const FriendCardWrapper = styled('div', {
    '> div': {
        borderRadius: '$default',
        padding: '$space-4 $space-2',
    },
});

const FriendCardBodyWrapper = styled('div', {
    'img': {
        marginBottom: '$space-3',
    },
});

const ActionWrapper = styled('div', {
    width: '100%',
    marginTop: '$space-3',
});

export const FriendCard = ({ values }) => {
    const ref = useRef();
    const navigate = useNavigate();

    const context = useOutletContext();

    const [isVisible, setIsVisible] = useState(false);
    const [arrowIcon, setArrowIcon] = useState(faCaretDown);
    const [status, setStatus] = useState('');
    const [help, setHelp] = useState('');

    const handleStatus = status => setStatus(status);
    const handleHelp = help => setHelp(help);
    const handleActionIcon = icon => setArrowIcon(icon);

    const handleShowModal = () => {
        handleStatus('warning');
        (values && values.first_name && values.last_name && values.username) && 
        handleHelp("Do you want to remove " + values.first_name + ' ' + values.last_name + " from your friends?");
        setIsVisible(true);
    }

    const handleHideModal = () => setIsVisible(false);

    const handleCaretUpIcon = () => {
        handleActionIcon(faCaretUp);
    }

    const handleCaretDownIcon = () => {
        handleActionIcon(faCaretDown);
    }

    const removeUserFriend = () => {
        if (context.isFriendsInvitationShown && isAuth() && (values && values.username)) {
            const declineMemberForm = new FormData();

            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            declineMemberForm.append('auth_username', JSON.parse(Cookies.get('auth_user')).username);
            declineMemberForm.append('username', values.username);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "friends/user/destroy", declineMemberForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleStatus('success');
                    (values && (values.first_name && values.last_name)) && 
                    handleHelp(values.first_name + ' ' + values.last_name + " was removed from your friends.");
                    setTimeout(() => {
                        ref.current.remove();
                        
                        handleHideModal();
                    }, 1000);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err friends section remove friend', err.response.data.errors);
                }
            });
        } else {
            console.log('on profile friends section remove friend: no cookies');
        }
    }

    const handleProfileNavigator = username => {
        navigate('/profile/' + username);
        context.handleForceRender();
    }

    const menu = (
        <Menu
            items={[
                {
                    label: <Text type="span" onClick={() => handleShowModal()}><FontAwesomeIcon
                        icon={faUserMinus}
                        className="fa-md fa-fw me-1"
                        style={{ color: '#F95F5F', }} /> Remove</Text>,
                },
            ]}
        />
    );

    return (
        <Column ref={ref}>
            <FriendCardWrapper>
                <Card>
                    <FriendCardBodyWrapper className="d-flex flex-column align-items-center">
                    {
                        (context.isFriendsInvitationShown) && 
                        <Dropdown
                        className="align-self-end"
                        overlay={menu}
                        trigger={['click', 'hover']}>
                            <a
                            onClick={e => e.preventDefault()}
                            onMouseEnter={() => handleCaretUpIcon()}
                            onMouseLeave={() => handleCaretDownIcon()}>
                                <FontAwesomeIcon
                                icon={arrowIcon}
                                className="fa-xl fa-fw"
                                style={{ color: '#666666', }} />
                            </a>
                        </Dropdown>
                    }
                        <Image src="/avatar_medium.png" css={{
                            width: '100%',
                            maxWidth: '100px',
                            height: 'auto',
                        }} />
                        <Text type="span" size="medium">{values && (values.first_name && values.last_name) && (values.first_name + ' ' + values.last_name)}</Text>
                        <Button 
                        type="button" text={values && (values.username) && ('@' + values.username) } 
                        onClick={() => handleProfileNavigator(values.username)}/>
                        <Text type="span" size="medium">{values && (values.username) && ('@' + values.username)}</Text>
                        {
                            (context.isFriendsInvitationShown) && 
                            <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-evenly align-items-sm-center">
                                <Button
                                type="button"
                                text="Message"
                                className="flex-grow-1 flex-sm-grow-0"
                                color="brown" />
                            </ActionWrapper>
                        }
                    </FriendCardBodyWrapper>
                </Card>
            </FriendCardWrapper>
            <Modal
            closable
            maskClosable
            isVisible={isVisible}
            width="550px"
            wrapClassName="test"
            onCancel={handleHideModal}>
                <Alert 
                status={status} 
                icon
                header="Confirmation">
                    <Text type="span">{help}</Text>
                </Alert>
            {
                <RemoveFriend
                values={values}
                handleHideModal={handleHideModal}
                removeUserFriend={removeUserFriend} 
                css={{ marginTop: '$space-3', }} />
            }
            </Modal>
        </Column>
    )
}

export default FriendCard;