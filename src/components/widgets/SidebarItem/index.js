import { NavLink, } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";

const SidebarItemWrapper = styled('div', {
    padding: '$space-2',
});

export const SidebarItem = ({ item, }) => {
    return (
        <NavLink to={(item && item.link) && item.link} className={({ isActive }) => isActive ? 'active-nav' : undefined}>
            <SidebarItemWrapper>
                <FontAwesomeIcon icon={(item && item.icon) && item.icon} className="fa-xl fa-fw" />
                <Text 
                type="span" 
                size="small"
                className="ms-3">
                    {(item && item.section) && item.section}
                </Text>
            </SidebarItemWrapper>
        </NavLink>
    )
}

export default SidebarItem;