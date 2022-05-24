import { styled } from "../../../stitches.config";

import DiscussionPostTrending from "../DiscussionPostTrending";

const DiscussionsSidebarWrapper = styled('div', {
    width: '300px',
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
    },
    '> div': {
        padding: '0px $space-3',
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
            <DiscussionPostTrending />
        </DiscussionsSidebarWrapper>
    )
}

export default DiscussionsSidebar;