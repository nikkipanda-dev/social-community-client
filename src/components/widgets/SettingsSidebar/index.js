import { NavLink, } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCircleInfo, 
    faBell,
    faUser,
    faAddressCard,
} from "@fortawesome/free-solid-svg-icons";
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";

const SettingsSidebarWrapper = styled('div', {});

const SettingsNavWrapper = styled('div', {
    padding:'$space-2',
    ':nth-child(n+2)': {
        marginTop: '$space-4',
    },
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

export const SettingsSidebar = () => {
    return (
        <SettingsSidebarWrapper>
            <SettingsNavWrapper className="d-flex flex-column">
                <NavLink to="information" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                    <FontAwesomeIcon icon={faCircleInfo} className="fa-fw fa-xl me-2" /><Text type="span">Information</Text>
                </NavLink>
                <NavLink to="profile" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                    <FontAwesomeIcon icon={faAddressCard} className="fa-fw fa-xl me-2" /><Text type="span">Profile</Text>
                </NavLink>
                <NavLink to="alerts" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                    <FontAwesomeIcon icon={faBell} className="fa-fw fa-xl me-2" /><Text type="span">Alerts</Text>
                </NavLink>
                <NavLink to="account" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                    <FontAwesomeIcon icon={faUser} className="fa-fw fa-xl me-2" /><Text type="span">Account</Text>
                </NavLink>
            </SettingsNavWrapper>
        </SettingsSidebarWrapper>
    )
}

export default SettingsSidebar;