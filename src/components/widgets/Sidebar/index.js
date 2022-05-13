import { NavLink, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import SidebarItem from "../SidebarItem";

const SidebarWrapper = styled('div', {
    width: '100%',
    boxSizing: 'border-box',
    'a:nth-child(n+2)': {
        marginTop: '$space-3',
    },
    'a': {
        transition: '$default',
        textDecoration: 'unset',
        color: '$black',
        fontFamily: '$manjari',
        fontSize: '$medium',
        letterSpacing: '$default',
    },
    'a > div > span': {
        marginTop: '$space-1',
        display: 'inline-block',
    },
    'a:hover': {
        color: '$pineGreen',
    },
    'a.active-nav': {
        color: '$pineGreen',
        background: '$white',
        borderRadius: '$small',
    },
});

const SidebarItemsWrapper = styled('div', {});

export const Sidebar = ({ items }) => {
    return (
        <SidebarWrapper>
            <Card css={{ 
                padding: '$space-3', 
                borderRadius: '$default', }}>
                <SidebarItemsWrapper className="d-flex flex-column">
                {
                    (items && (Object.keys(items).length > 0)) &&
                    Object.keys(items).map((i, val) => {
                        return <SidebarItem key={Object.values(items)[val].id} item={Object.values(items)[val]} />
                    })
                }
                </SidebarItemsWrapper>
            </Card>
        </SidebarWrapper>
    )
}

export default Sidebar;