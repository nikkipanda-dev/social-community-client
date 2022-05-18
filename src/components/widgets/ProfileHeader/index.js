import { useParams, useOutletContext, } from 'react-router-dom';
import { useState, useEffect, useLayoutEffect, } from 'react';
import { isAuth, key, showAlert, } from '../../../util';
import Cookies from 'js-cookie';
import { message, } from 'antd';
import { axiosInstance } from '../../../requests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserPlus, 
    faBan,
    faUserMinus, 
    faEnvelope, 
    faCircleCheck,
    faHourglass,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Heading from '../../core/Heading';
import Text from '../../core/Text';
import Card from "../../core/Card";
import Image from "../../core/Image";
import Button from '../../core/Button';
import Modal from '../Modal';
import InvitationAccept from '../FriendInvitationAccept';

const ProfileHeaderWrapper = styled('div', {});

const ProfileHeaderBodyWrapper = styled('div', {});

const ProfileHeaderContentWrapper = styled('div', {
    padding: '0px $space-4',
});

const AvatarWrapper = styled('div', {
    '@media screen and (max-width: 576px)': {
        display: 'flex',
        justifyContent: 'center',
    },
});

const ProfileHeaderActionWrapper = styled('div', {
    '> span:nth-child(n+2)': {
        marginLeft: '$space-4',
    },
    '@media screen and (max-width: 1199px)': {
        width: '100%',
        padding: '$space-3 0px',
    },
    '@media screen and (max-width: 991px)': {
        display: 'none',
    },
});

const ProfileHeaderNameWrapper = styled('div', {
    '@media screen and (max-width: 1199px)': {
        width: '100%',
    },
    '@media screen and (max-width: 576px)': {
        marginTop: '$space-3',
    },
});

const ProfileHeaderIntroWrapper = styled('div', {
    marginTop: '$space-5',
    '> span': {
        position: 'relative',
        marginLeft: '30px',
    },
    '> span::before': {
        content: '“',
        position: 'absolute',
        top: '-45px',
        left: '-35px',
        opacity: '.2',
        fontSize: '150px',
    },
});

const ProfileBadgeWrapper = styled('div', {
    background: '$lightGray1',
    borderRadius: '0px $default $default 0px',
    padding: '$space-4',
});

const ProfileHeaderItemWrapper = styled('div', {});

export const ProfileHeader = ({ 
    member, 
    isActionShown,
    handleShowContent,
    handleHideContent,
}) => {
    const params = useParams();

    const [isVisible, setIsVisible] = useState(false);
    const [isVerticalAction, setIsVerticalAction] = useState(false);
    const [isSender, setIsSender] = useState(false);
    const [friendStatus, setFriendStatus] = useState('');

    const handleShowModal = () => setIsVisible(true);
    const handleHideModal = () => setIsVisible(false);
    const handleIsSender = () => setIsSender(true);
    const handleFriendStatus = friendStatus => setFriendStatus(friendStatus);
    const handleShowVerticalAction = () => setIsVerticalAction(true);
    const handleHideVerticalAction = () => setIsVerticalAction(false);

    const addFriend = () => {
        if (isAuth()) {
            const addFriendForm = new FormData();

            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            addFriendForm.append('auth_username', JSON.parse(Cookies.get('auth_user')).username);
            addFriendForm.append('username', params.username);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "friends/user/store", addFriendForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleFriendStatus(response.data.data.details.status);
                    handleIsSender(response.data.data.details.is_sender);
                    showAlert();
                    setTimeout(() => {
                        message.open({
                            content: <>
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="me-2"
                                    style={{ color: '#007B70', }} />
                                <Text type="span">Invitation sent.</Text>
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
                    console.log('err add friend', err.response.data.errors);
                }
            });
        } else {
            console.log('on profile add friend: no cookies');
        }
    }

    const removeFriend = () => {
        console.log('remove ')
        if (isAuth()) {
            const removeFriendForm = new FormData();

            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            removeFriendForm.append('auth_username', JSON.parse(Cookies.get('auth_user')).username);
            removeFriendForm.append('username', params.username);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "friends/user/destroy", removeFriendForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleFriendStatus('');
                    handleHideContent();
                    setIsSender(false); 
                    showAlert();
                    setTimeout(() => {
                        isVisible && handleHideModal();

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
                    console.log('err remove friend', err.response.data.errors);
                }
            });
        } else {
            console.log('on profile remove friend: no cookies');
        }
    }

    const sendMessage = () => {
        console.log('send');
    }

    const getFriendStatus = () => {
        if (isAuth()) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "friends/user/get-friend", {
                params: {
                    auth_username: JSON.parse(Cookies.get('auth_user')).username,
                    username: params.username,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    ((response.data.data.details.status === 'accepted') || (params.username === JSON.parse(Cookies.get('auth_user')).username)) ? handleShowContent() : handleHideContent();

                    (response.data.data.details.is_sender) && handleIsSender();
                    handleFriendStatus(response.data.data.details.status);
                } else {
                    handleFriendStatus('not friend');
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err is friend', err.response.data.errors);
                }
            });
        } else {
            console.log('on profile is friend: no cookies');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading) {
            getFriendStatus();
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;

        if (loading && (friendStatus && (friendStatus === 'accepted'))) {
            handleShowContent();
        }

        return () => {
            loading = false;
        }
    }, [friendStatus]);

    useLayoutEffect(() => {
        let loading = true;

        const getWidth = () => {
            if (window.innerWidth <= 1199) {
                handleShowVerticalAction();
                console.log('show');
            } else {
                handleHideVerticalAction();
                console.log('hide');
            }
        };

        if (loading) {
            window.addEventListener('resize', getWidth);
        }

        return () => window.removeEventListener('resize', getWidth);
    }, []);

    console.log('friend stat ', friendStatus);
    console.log('isSender ', isSender);
    console.log('isVerticalAction ', isVerticalAction);

    return (
        <ProfileHeaderWrapper>
            <Card css={{ borderRadius: '$default', }}>
                <ProfileHeaderBodyWrapper className="d-flex flex-column flex-sm-row">
                    <AvatarWrapper className="d-flex flex-column justify-content-center" css={{ padding: '$space-3', }}>
                        <Image  className="mx-auto" src="/avatar_medium.png" css={{ 
                            width: '100%', 
                            height: 'auto',
                            maxWidth: '250px',
                            maxheight: '250px',
                            objectFit: 'cover',
                        }}/>
                    {
                        (isVerticalAction) && 
                        <ProfileHeaderActionWrapper className="d-flex justify-content-center">
                            <Button
                            type="button"
                            color="transparent"
                            className={(friendStatus === 'accepted') ? "button-plain-red" : "button-plain"}
                            text={<Text type="span">
                                <FontAwesomeIcon icon={
                                    (isSender && (friendStatus === 'pending')) ? faBan :
                                    (!(isSender) && (friendStatus === 'pending')) ? faHourglass :
                                    (friendStatus === 'accepted') ? faUserMinus : faUserPlus
                                } className="fa-2xl fa-fw me-1" />
                            </Text>}
                            onClick={() => 
                                ((isSender && (friendStatus === 'pending')) || (friendStatus === 'accepted')) ? removeFriend() :
                                (!(isSender) && (friendStatus === 'pending')) ? handleShowModal() : addFriend()
                            } />
                            <Button
                            type="button"
                            color="transparent"
                            className="button-plain"
                            text={<Text type="span">
                                <FontAwesomeIcon icon={faEnvelope} className="fa-2xl fa-fw me-1" />
                            </Text>}
                            onClick={() => sendMessage()} />
                        </ProfileHeaderActionWrapper>
                    }
                    </AvatarWrapper>
                    <ProfileHeaderContentWrapper className="flex-grow-1 d-flex flex-column justify-content-start" css={{ padding: '$space-3', }}>
                        <ProfileHeaderItemWrapper className="d-flex flex-column flex-xl-row align-items-start">
                            <ProfileHeaderNameWrapper className="text-center text-sm-start">
                                <Heading type={5} text={(member && member.first_name && member.last_name) && member.first_name + ' ' + member.last_name} />
                                <Text type="span">{(member && member.username) && ('@' + member.username)}</Text>
                            </ProfileHeaderNameWrapper>
                        {
                            (isActionShown) && 
                            <ProfileHeaderActionWrapper className="d-none flex-grow-1 d-xl-flex justify-content-center justify-content-sm-start justify-content-xl-end align-items-start">
                                <Button
                                type="button"
                                color="transparent"
                                className={
                                    (friendStatus && (friendStatus === 'accepted')) ? "button-plain-red" : "button-plain"
                                }
                                text={<Text type="span">
                                    <FontAwesomeIcon icon={
                                        (isSender && (friendStatus === 'pending')) ? faBan :
                                        (!(isSender) && (friendStatus === 'pending')) ? faHourglass :
                                        (friendStatus === 'accepted') ? faUserMinus : faUserPlus
                                    } className="fa-2xl fa-fw me-1" />
                                {
                                    (isSender && (friendStatus === 'pending')) ? 'Cancel invitation' :
                                    (!(isSender) && (friendStatus === 'pending')) ? 'Pending invitation' : 
                                    (friendStatus === 'accepted') ? 'Remove' : 'Add'
                                }
                                </Text>}
                                onClick={() => 
                                    ((isSender && (friendStatus === 'pending')) || (friendStatus === 'accepted')) ? removeFriend() :
                                    (!(isSender) && (friendStatus === 'pending')) ? handleShowModal() : addFriend()
                                } />
                                <Button
                                type="button"
                                color="transparent"
                                className="button-plain"
                                text={<Text type="span">
                                    <FontAwesomeIcon icon={faEnvelope} className="fa-2xl fa-fw me-1" />
                                    Message
                                </Text>}
                                onClick={() => sendMessage()} />
                            </ProfileHeaderActionWrapper>
                        }
                        </ProfileHeaderItemWrapper>
                        <ProfileHeaderIntroWrapper className="text-center text-sm-start">
                            <Text type="span" size="medium">
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus, voluptatum.
                            </Text>
                        </ProfileHeaderIntroWrapper>
                    </ProfileHeaderContentWrapper>
                    <ProfileBadgeWrapper className="d-none d-xl-flex justify-content-center align-items-center">
                        <Image 
                        src="/badges/rookie.png" 
                        className="d-none d-lg-block"
                        css={{ 
                            width: '100%',
                            height: 'auto',
                            maxWidth: '200px',
                            objectFit: 'cover',
                        }} />
                    </ProfileBadgeWrapper>
                </ProfileHeaderBodyWrapper>
            </Card>
            <Modal 
            closable
            maskClosable
            title="Confirmation"
            isVisible={isVisible}
            onCancel={handleHideModal}>
                <InvitationAccept 
                member={member} 
                removeFriend={removeFriend}
                handleHideModal={handleHideModal}
                handleFriendStatus={handleFriendStatus} />
            </Modal>
        </ProfileHeaderWrapper>
    )
}

export default ProfileHeader;
