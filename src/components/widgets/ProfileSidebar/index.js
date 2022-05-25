import { ProfileSidebarItems } from '../../../util/NavLinks/Profile';
import { styled } from "../../../stitches.config";

import Sidebar from "../Sidebar";
import ProfileGeneralInformation from '../ProfileGeneralInformation';
import ProfileRecentActivities from '../ProfileRecentActivities';
import Badges from '../Badges';
import Achievements from '../Achievements';

const ProfileSidebarWrapper = styled('div', {
    width: '400px',
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
    },
    '> div': {
        padding: '0px $space-3 0px 0px',
    },
});

export const ProfileSidebar = ({ 
    isAuth,
    isContentShown,
    className, 
    css, 
}) => {
    return (
        <ProfileSidebarWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <Sidebar 
            isAuth={isAuth}
            isContentShown={isContentShown}
            items={ProfileSidebarItems} 
            className="d-flex flex-column" />
            <ProfileGeneralInformation />
            <Badges />
            <Achievements />
            {
                isContentShown && 
                <ProfileRecentActivities />
            }
        </ProfileSidebarWrapper>
    )
}

export default ProfileSidebar;
