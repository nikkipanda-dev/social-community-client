import { useState, useEffect, } from "react";
import { 
    Outlet, 
    NavLink, 
    useParams,
} from "react-router-dom";
import Cookies from 'js-cookie';
import { isAuth } from "../../../util";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass, faUserGroup, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Text from "../../core/Text";

const FriendsWrapper = styled('div', {
    maxWidth: '1700px',
});

const FriendsNavWrapper = styled('div', {
    borderRadius: '$default',
    maxWidth: 'inherit',
    marginBottom: '$space-3',
    background: '$lightGray',
    'a': {
        transition: '$default',
        textDecoration: 'unset',
        marginRight: '$space-2',
        color: '$black',
        fontFamily: '$manjari',
        fontSize: '$medium',
        letterSpacing: '$default',
    },
    'a > span': {
        display: 'inline-block',
        padding: '$space-3',
    },
    'a:hover': {
        color: '$pineGreen',
    },
    'a.active-nav': {
        color: '$pineGreen',
    },
});

export const Friends = () => {
    const params = useParams();

    const [isContentShown, setIsContentShown] = useState(false);

    const handleShowContent = () => setIsContentShown(true);
    const handleHideContent = () => setIsContentShown(false);

    useEffect(() => {
        let loading = true;

        if (loading) {
            (isAuth() && (params.username === JSON.parse(Cookies.get('auth_user')).username)) ? handleShowContent() : handleHideContent();
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <Section>
            <FriendsWrapper className="mx-auto">
            {
                isContentShown &&
                <FriendsNavWrapper>
                    <NavLink to="invitations" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                        <Text type="span" size="medium"><FontAwesomeIcon className="me-2 fa-fw" icon={faHourglass} />Invitations</Text>
                    </NavLink>
                    <NavLink to="all" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                        <Text type="span" size="medium"><FontAwesomeIcon className="me-2 fa-fw" icon={faUserGroup} />All Friends</Text>
                    </NavLink>
                </FriendsNavWrapper>
            }
                <Outlet context={isContentShown}/>
            </FriendsWrapper>
        </Section>
    )
}

export default Friends;