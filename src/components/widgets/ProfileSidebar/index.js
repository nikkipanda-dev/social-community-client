import { 
    faQuoteLeft,
    faBook,
    faIdCard,
    faUserGroup,
    faChalkboardUser,
    faBlog, 
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Sidebar from "../Sidebar";
import ProfileGeneralInformation from '../ProfileGeneralInformation';
import ProfileRecentActivities from '../ProfileRecentActivities';
import Badges from '../Badges';
import Achievements from '../Achievements';

const ProfileSidebarWrapper = styled('div', {
    maxWidth: '500px',
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
    },
    '> div': {
        padding: '0px $space-3 0px 0px',
    },
});

export const ProfileSidebar = () => {
    const items = [
        {
            id: 1,
            section: "Microblog",
            link: "microblog",
            icon: faQuoteLeft,
        },
        {
            id: 2,
            section: "Journal",
            link: "journal",
            icon: faBook,
        },
        {
            id: 3,
            section: "About",
            link: "about",
            icon: faIdCard,
        },
        {
            id: 4,
            section: "Friends",
            link: "friends",
            icon: faUserGroup,
        },
        {
            id: 5,
            section: "Discussions",
            link: "discussions",
            icon: faChalkboardUser,
        },
        {
            id: 6,
            section: "Community Blog Posts",
            link: "community-blog",
            icon: faBlog,
        },
    ];

    return (
        <ProfileSidebarWrapper>
            <Sidebar items={items}/>
            <ProfileGeneralInformation />
            <Badges />
            <Achievements />
            <ProfileRecentActivities />
        </ProfileSidebarWrapper>
    )
}

export default ProfileSidebar;
