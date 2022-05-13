import { useState, useEffect, useLayoutEffect, } from 'react';
import { isAuth } from '../../../util';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEnvelope, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Heading from '../../core/Heading';
import Text from '../../core/Text';
import Card from "../../core/Card";
import Image from "../../core/Image";
import Button from '../../core/Button';

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

export const ProfileHeader = () => {
    const [isVerticalAction, setIsVerticalAction] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [id, setId] = useState('');

    const handleShowVerticalAction = () => setIsVerticalAction(true);
    const handleHideVerticalAction = () => setIsVerticalAction(false);

    const handleId = id => setId(id);
    const handleFirstName = firstName => setFirstName(firstName);
    const handleLastName = lastName => setLastName(lastName);
    const handleUsername = username => setUsername(username);

    const addMember = () => {
        console.log('add member');
    }

    const sendMessage = () => {
        console.log('send');
    }

    useEffect(() => {
        let loading = true;

        if (loading) {
            if (isAuth()) {
                handleId(JSON.parse(Cookies.get('auth_user')).id);
                handleFirstName(JSON.parse(Cookies.get('auth_user')).first_name);
                handleLastName(JSON.parse(Cookies.get('auth_user')).last_name);
                handleUsername(JSON.parse(Cookies.get('auth_user')).username);
            }
        }

        return () => {
            loading = false;
        }
    }, []);

    useLayoutEffect(() => {
        let loading = true;

        const getWidth = () => {
            // console.log(window.innerWidth);
            if (window.innerWidth <= 1199) {
                handleShowVerticalAction();
            } else {
                handleHideVerticalAction();
            }
        };

        if (loading) {
            window.addEventListener('resize', getWidth);
        }

        return () => window.removeEventListener('resize', getWidth);
    }, []);

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
                        isVerticalAction && 
                        <ProfileHeaderActionWrapper className="d-flex justify-content-center">
                            <Button
                            type="button"
                            color="transparent"
                            className="button-plain"
                            text={<Text type="span">
                                <FontAwesomeIcon icon={faUserPlus} className="fa-2xl fa-fw me-1" />
                            </Text>}
                                onClick={() => addMember()} />
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
                                <Heading type={5} text="Jane Doe" />
                                <Text type="span">@janedoe</Text>
                            </ProfileHeaderNameWrapper>
                            <ProfileHeaderActionWrapper className="d-none flex-grow-1 d-xl-flex justify-content-center justify-content-sm-start justify-content-xl-end align-items-start">
                                <Button 
                                type="button" 
                                color="transparent" 
                                className="button-plain" 
                                text={<Text type="span">
                                    <FontAwesomeIcon icon={faUserPlus} className="fa-2xl fa-fw me-1" />
                                    Add
                                </Text>} 
                                onClick={() => addMember()} />
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
        </ProfileHeaderWrapper>
    )
}

export default ProfileHeader;
