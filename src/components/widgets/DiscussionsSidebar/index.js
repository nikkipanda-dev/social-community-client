import { styled } from "../../../stitches.config";

import DiscussionPostTrending from "../DiscussionPostTrending";

const DiscussionsSidebarWrapper = styled('div', {
    width: '450px',
    marginTop: '0px',
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
    },
    '@media screen and (max-width: 991px)': {
        marginTop: '$space-5',
    },
});

export const DiscussionsSidebar = ({ 
    isAuth, 
    className, 
    slug,
    css,
}) => {
    return (
        <DiscussionsSidebarWrapper className={'' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <DiscussionPostTrending isAuth={isAuth} slug={slug} />
        </DiscussionsSidebarWrapper>
    )
}

export default DiscussionsSidebar;