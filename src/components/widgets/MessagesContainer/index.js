import { forwardRef, } from "react";
import { styled } from "../../../stitches.config";

import MessageBubble from "../MessageBubble";

const MessagesContainerWrapper = styled('div', {
    padding: '$space-3',
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
    },
});

export const MessagesContainer = forwardRef(({ 
    messages, 
    isAuth,
    handleShowModal,
    displayPhoto,
    friendDisplayPhoto,
}, ref) => {
    return (
        <MessagesContainerWrapper className="d-flex flex-column bg-light" ref={ref}>
        {
            (messages && (Object.keys(messages).length > 0)) && 
            Object.keys(messages).map((_, val) => <MessageBubble 
            key={Object.values(messages)[val].created_at.seconds} 
            values={Object.values(messages)[val]}
            displayPhoto={displayPhoto}
            friendDisplayPhoto={friendDisplayPhoto}
            handleShowModal={handleShowModal}
            isAuth={isAuth} />)
        }
        </MessagesContainerWrapper>
    )
});

export default MessagesContainer;