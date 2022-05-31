import { styled } from "../../../stitches.config";

import MessagesUsers from "../MessagesUsers";

const HeaderWrapper = styled('div', {
    height: '10vh',
});

const MessagesSidebarWrapper = styled('div', {
    height: '65vh',
    overflow: 'scroll',
});

export const MessagesSidebar = () => {
    return (
        <MessagesSidebarWrapper>
            <HeaderWrapper>
                header nav
            </HeaderWrapper>
            <MessagesUsers />
        </MessagesSidebarWrapper>
    )
}

export default MessagesSidebar;