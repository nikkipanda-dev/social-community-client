import { ProfileSidebarItems } from '../../../util/NavLinks/Profile';
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

export const ProfileSidebar = ({ className, css, }) => {

    return (
        <ProfileSidebarWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <Sidebar items={ProfileSidebarItems} className="d-flex flex-column" />
            <ProfileGeneralInformation />
            <Badges />
            <Achievements />
            <ProfileRecentActivities />
        </ProfileSidebarWrapper>
    )
}

export default ProfileSidebar;