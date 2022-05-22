import { DiscussionsSidebarItems } from "../../../util/NavLinks/Discussions";
import { styled } from "../../../stitches.config";

import Sidebar from "../Sidebar";

const DiscussionsSidebarWrapper = styled('div', {
    width: '400px',
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
    },
    '> div': {
        padding: '0px $space-3 0px 0px',
    },
});

export const DiscussionsSidebar = ({ 
    isAuth, 
    isContentShown, 
    className, 
    css,
}) => {
    return (
        <DiscussionsSidebarWrapper className={'bg-warning' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <Sidebar 
            isAuth={isAuth}
            cardcss={{ background: 'none' }}
            css={css}
            isContentShown={isContentShown}
            items={DiscussionsSidebarItems} />
        </DiscussionsSidebarWrapper>
    )
}

export default DiscussionsSidebar;