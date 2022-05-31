import Cookies from 'js-cookie';
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";

const MessageBubbleWrapper = styled('div', {
    maxWidth: '350px',
});

const MiscWrapper = styled('div', {});

export const MessageBubble = ({ values, isAuth, }) => {
    return (
        (values && (Object.keys(values).length > 0) && isAuth) && 
        <MessageBubbleWrapper className={"d-flex flex-column" + ((values.username === JSON.parse(Cookies.get('auth_user')).username) ? " align-self-end" : " align-self-start")}> 
            <MiscWrapper css={{ 
                background: '$lightGray1', 
                padding: '$space-3 $space-3 0px',
                borderRadius: '$default',
            }}>
                {/* <Text type="span">{values.first_name}</Text>
            <Text type="span">{values.last_name}</Text> */}
                <Text type="paragraph" css={{ marginTop: '$space-1', }}>{values.message}</Text>
            </MiscWrapper>
            <MiscWrapper className="align-self-center align-self-sm-end">
                <Text
                type="span"
                size="tiny"
                color="darkGray">
                {
                    new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Asia/Manila',
                        hourCycle: 'h12',
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    }).format(new Date(values.created_at))
                }
                </Text>
            </MiscWrapper>
        </MessageBubbleWrapper>
    )
}

export default MessageBubble;
