import { useState, useEffect, } from "react";
import { 
    Outlet, 
    useOutletContext,
    NavLink, 
    useParams,
} from "react-router-dom";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faFeatherPointed, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Text from "../../core/Text";

const JournalWrapper = styled('div', {});

const JournalNavWrapper = styled('div', {
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

export const Journal = () => {
    const params = useParams();
    const context = useOutletContext();

    const [isJournalNavShown, setIsJournalNavShown] = useState(true);
    const [isJournalShown, setIsJournalShown] = useState(false);

    const handleToggleJournalNav = () => setIsJournalNavShown(!isJournalNavShown);
    const handleShowJournalEntries = () => setIsJournalShown(true);
    const handleHideJournalEntries = () => setIsJournalShown(false);

    useEffect(() => {
        let loading = true;

        if (loading) {
            (context.isAuth && (params.username === JSON.parse(Cookies.get('auth_user')).username)) ? handleShowJournalEntries() : handleHideJournalEntries();
        }

        return () => {
            loading = false;
        }
    }, []);
    
    return (
        <Section>
            <JournalWrapper className="mx-auto">
            {
                (isJournalShown && isJournalNavShown) &&
                <JournalNavWrapper>
                    <NavLink to="editor" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                        <Text type="span" size="medium"><FontAwesomeIcon className="me-2 fa-fw" icon={faFeatherPointed} />Create</Text>
                    </NavLink>
                    <NavLink to="all" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                        <Text type="span" size="medium"><FontAwesomeIcon className="me-2 fa-fw" icon={faBook} />All Journal Entries</Text>
                    </NavLink>
                </JournalNavWrapper>
            }
                <Outlet context={{
                    isAuth: context.isAuth,
                    isJournalShown: isJournalShown,
                    handleToggleJournalNav: handleToggleJournalNav,
                }} />
            </JournalWrapper>
        </Section>
    )
}

export default Journal;