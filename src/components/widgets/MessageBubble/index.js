import { 
    forwardRef, 
    useState, 
    useRef,
    useEffect,
} from 'react';
import Cookies from 'js-cookie';
import { auth, db, } from '../../../util/Firebase';
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";

const MessageBubbleWrapper = styled('div', {
    maxWidth: '350px',
});

const MiscWrapper = styled('div', {});

export const MessageBubble = forwardRef(({ 
    values, 
    isAuth,
}, ref) => {
    const messageBubbleRef = useRef('');
    const [message, setMessage] = useState('');

    const handleMessage = message => setMessage(message);

    useEffect(() => {
        let loading = true;

        if (loading && values && (Object.values(values).length > 0)) {
            handleMessage(values);
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;

        if (loading) {
            messageBubbleRef.current?.scrollIntoView({ behavior: 'smooth', });
        }

        return () => {
            loading = false;
        }
    }, [message]);

    return (
        (values && (Object.keys(values).length > 0) && isAuth && auth.currentUser) && 
        <MessageBubbleWrapper className={"d-flex flex-column" + ((values.sender === auth.currentUser.uid) ? " align-self-end" : " align-self-start")} ref={messageBubbleRef}> 
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
                    }).format(new Date(values.created_at.toDate()))
                }
                </Text>
            </MiscWrapper>
        </MessageBubbleWrapper>
    )
});

export default MessageBubble;
