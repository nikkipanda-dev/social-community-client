import { useParams, } from "react-router-dom";
import Cookies from 'js-cookie';
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

export const Sidebar = ({ 
    isAuth,
    isContentShown,
    items, 
    className, 
    css,
}) => {
    const params = useParams();

    return (
        isContentShown && 
        <SidebarWrapper>
            <Card css={{ 
                padding: '$space-3', 
                borderRadius: '$default', }}>
                <SidebarItemsWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
                {
                    (items && (Object.keys(items).length > 0)) &&
                    Object.keys(items).map((_, val) => {
                        if (((Object.values(items)[val].section.toLowerCase() === 'journal') && isAuth && (params.username === JSON.parse(Cookies.get('auth_user')).username))) {
                            return <SidebarItem
                            key={Object.values(items)[val].id}
                            item={Object.values(items)[val]}
                            isAuth={isAuth} /> 
                        }
                        
                        if (Object.values(items)[val].section.toLowerCase() !== 'journal') {
                            return <SidebarItem
                            key={Object.values(items)[val].id}
                            item={Object.values(items)[val]}
                            isAuth={isAuth} /> 
                        }
                    })
                }
                </SidebarItemsWrapper>
            </Card>
        </SidebarWrapper>
    )
}

export default Sidebar;