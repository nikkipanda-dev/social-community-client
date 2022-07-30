import { useState, useEffect, } from 'react';
import { useNavigate, NavLink, } from 'react-router-dom';
import Cookies from 'js-cookie';
import { 
    message, 
    Dropdown, 
    Menu,
    Badge,
} from 'antd';
import { signOut, } from 'firebase/auth';
import { 
    doc, 
    getDoc, 
    updateDoc,
} from 'firebase/firestore';
import { auth, db, } from '../../../util/Firebase';
import { 
    key, 
    showAlert,
} from '../../../util';
import { axiosInstance } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell, 
    faCircleCheck,
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Row from '../../core/Row';
import Column from '../../core/Column';
import Text from '../../core/Text';
import Image from '../../core/Image';
import Modal from '../Modal';
import Login from '../LogIn';
import { ref } from 'firebase/storage';

const LogoWrapper = styled('div', {});

const NavGroupWrapper = styled('div', {
    height: '100%',
});

const NavLinkGroupWrapper = styled('div', {
    background: 'white',
    borderRadius: '70px',
    'a': {
        transition: '$default',
        textDecoration: 'unset',
        marginLeft: '$space-4',
        color: '$black',
        fontFamily: '$manjari',
        fontSize: '$medium',
        letterSpacing: '$default',
    },
    'a:hover': {
        color: '$pineGreen',
    },
    'img:hover': {
        cursor: 'pointer',
    },
    '.login-button:hover': {
        cursor: 'pointer',
    },
    'a.active-nav': {
        color: '$pineGreen',
    },
});

export const Navbar = ({
    className,
    css,
    isAuth,
    displayPhoto,
    handleForceRender,
    handleLogIn,
    handleLogOut,
    notifications,
    onClearNotifications,
}) => {      
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    let mailable;

    const handleShowModal = () => setIsVisible(true);
    const handleHideModal = () => setIsVisible(false);

    const NavbarWrapper = styled('div', {
        width: '100%',
        zIndex: '$default',
        background: isAuth ? "50% 80% / cover no-repeat url('/navbar_backdrop.png')" : "transparent",
    });

    const handleNavigator = params => {
        navigate(params, { replace: true, });
    }

    const logout = () => {
        if (isAuth && auth && db) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            const logoutForm = new FormData();
            logoutForm.append('email', JSON.parse(Cookies.get('auth_user')).email);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + 'logout', logoutForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    console.log('success');
                    Cookies.remove('auth_user');
                    Cookies.remove('auth_user_token');
                    Cookies.get('auth_user_display_photo') && Cookies.remove('auth_user_display_photo');
                    Cookies.remove('auth_user_firebase_secret');

                    if (!(Cookies.get('auth_user')) && !(Cookies.get('auth_user_token')) && !(Cookies.get('auth_user_firebase_secret'))) {
                        console.log('ok no cookies ');
                        updateDoc(doc(db, "users", auth.currentUser.uid), {
                            isOnline: false,
                        }).then(response => {
                            signOut(auth).then(() => {
                                console.log('signed out ');
                                handleLogOut();
                                navigate('/');

                                showAlert();
                                setTimeout(() => {
                                    message.open({
                                        content: <><FontAwesomeIcon icon={faCircleCheck} className="me-2" /><Text type="span">Logged out.</Text></>,
                                        key,
                                        duration: 2,
                                        style: {
                                            marginTop: '25vh',
                                            zIndex: '99999999',
                                        }
                                    });
                                }, 1500);
                            })

                            .catch(error => {
                                console.error('err res ', error);
                            });
                        })
                        
                        .catch(updateErr => {
                            console.error('err upda ', updateErr);
                        });
                    } else {
                        console.error('cookies err');
                    }
                } else {
                    console.error('err res ', response.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response.data.errors : err);
            });
        } else {
            console.log('on logout: no cookies');
        }
    }

    if (notifications && notifications.notifications) {
        mailable = (
            <Menu
                items={[
                    {
                        type: 'group',
                        label: <Text type="span" color="darkGray">Admin</Text>,
                        children: [
                            {
                                key: '1',
                                label: <Text type="span">Dashboard</Text>,
                            },
                        ],
                    },
                    {
                        type: 'group',
                        label: <Text type="span" color="darkGray">Account</Text>,
                        children: [
                            {
                                key: '2',
                                label: <Text type="span">Settings</Text>,
                            },
                        ],
                    },
                    {
                        type: 'divider',
                    },
                    {
                        label: 
                        notifications.friend_requests && 
                        <Text type="span" onClick={() => handleNavigator('/profile/' + JSON.parse(Cookies.get('auth_user')).username + '/friends/invitations') }>You have {notifications.friend_requests.length} friend request{notifications.friend_requests.length > 1 ? 's' : ''}</Text>,
                    },
                    {
                        label:
                        <Text type="span" onClick={() => handleNavigator('/notifications')}>View all</Text>,
                    },
                ]}
            />
        );
    } else {
        mailable = (
            <Menu
                items={[
                    {
                        label: <Text type="span" css={{ '&:hover': { cursor: 'default', } }}>No new notifications yet.</Text>,
                    },
                    {
                        label:
                        <Text type="span" onClick={() => handleNavigator('/notifications')}>View all</Text>,
                    },
                ]}
            />
        );
    }
    

    const menu = (
        <Menu
            items={[
                {
                    type: 'group',
                    label: <Text type="span" color="darkGray">Account</Text>,
                    children: [
                        {
                            key: '1',
                            label: <Text type="span" onClick={() => handleNavigator("/settings/information")}>Settings</Text>,
                        },
                    ],
                },
                {
                    type: 'divider',
                },
                {
                    label: <Text type="span" onClick={() => logout()}>Sign out</Text>,
                },
            ]}
        />
    );

    return (
        <NavbarWrapper className={'sticky-top' + (className ? (' ' + className) : '')} css={{ ...css }}>
        {
            <Row className="m-0 g-0 mx-auto" css={{
                maxWidth: '1700px',
                minHeight: '7vh',
                padding: '$space-3',
            }}>
                <Column className="col-sm-auto">
                    <LogoWrapper>
                        <Image src="/casualcampersclub_logo.png" css={{ 
                            width: '100%',
                            maxWidth: '70px',
                            height: 'auto',
                        }} />
                    </LogoWrapper>
                </Column>
                <Column className="col d-flex align-items-center">
                    <NavGroupWrapper className="flex-grow-1 d-flex justify-content-center justify-content-sm-end align-items-center">
                        <NavLinkGroupWrapper className="mt-3 mt-sm-0">
                        {
                            isAuth ? 
                            <>
                                <NavLink to="/home" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                                    <Text type="span" size="medium">Home</Text>
                                </NavLink>
                                <NavLink 
                                to={"/profile/" + JSON.parse(Cookies.get('auth_user')).username} 
                                className={({ isActive }) => isActive ? 'active-nav' : undefined}
                                onClick={() => handleForceRender()}>
                                    <Text type="span" size="medium">Profile</Text>
                                </NavLink>
                                <NavLink to="/community-blog" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                                    <Text type="span" size="medium">Community Blog</Text>
                                </NavLink>
                                <NavLink to="/discussions" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                                    <Text type="span" size="medium">Discussions</Text>
                                </NavLink>
                                <NavLink to="/events" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                                    <Text type="span" size="medium">Events</Text>
                                </NavLink>
                                <NavLink to="/messages" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                                    <FontAwesomeIcon icon={faEnvelope} className="ms-3 fa-xl" />
                                </NavLink>
                                <Badge
                                color={notifications && !(notifications.seen) ? "#007B70" : '#DDDDDD'}
                                dot
                                size='default'
                                offset={[10, 5]}>
                                    <Dropdown overlay={mailable} arrow>
                                        <a onMouseEnter={() => onClearNotifications()} onClick={e => e.preventDefault()}>
                                            <FontAwesomeIcon icon={faBell} className="ms-3 fa-xl" />
                                        </a>
                                    </Dropdown>
                                </Badge>
                                <Dropdown overlay={menu} arrow>
                                    <a onClick={e => e.preventDefault()}>
                                        <Image
                                        src={displayPhoto ? displayPhoto : "/avatar_medium.png"}
                                        className="ms-3"
                                        css={{ 
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '100%',
                                        }} />
                                    </a>
                                </Dropdown>
                            </> : 
                            <>
                                <Text type="span" 
                                className="login-button" 
                                onClick={handleShowModal}>
                                    Log In
                                </Text>
                            </>
                        }
                        </NavLinkGroupWrapper>
                    </NavGroupWrapper>
                </Column>
            </Row>
        }
        <Modal
        isVisible={isVisible}
        maskClosable
        closable
        title="Log In"
        width="550px"
        onCancel={handleHideModal}>
            <Login 
            isAuth={isAuth}
            handleLogIn={handleLogIn} 
            handleHideModal={handleHideModal} />
        </Modal>
        </NavbarWrapper>
    )
}

export default Navbar;