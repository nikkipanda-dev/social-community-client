import { styled } from "../../../stitches.config";

import MessageBubble from "../MessageBubble";

const MessagesContainerWrapper = styled('div', {
    padding: '$space-3',
    width: '100%',
    height: '60vh',
    overflow: 'scroll',
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
    },
});

export const MessagesContainer = ({ messages, isAuth, }) => {
    return (
        <MessagesContainerWrapper className="d-flex flex-column bg-light">
        {
            (messages && (Object.keys(messages).length > 0)) && 
            Object.keys(messages).map((_, val) => <MessageBubble 
            key={Object.values(messages)[val].id} 
            values={Object.values(messages)[val]}
            isAuth={isAuth} />)
        }
        </MessagesContainerWrapper>
    )
}

export default MessagesContainer;