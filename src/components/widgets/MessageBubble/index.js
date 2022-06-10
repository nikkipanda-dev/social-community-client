import { 
    forwardRef, 
    useState, 
    useRef,
    useEffect,
} from 'react';
import { auth, } from '../../../util/Firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faEnvelopeCircleCheck, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import Image from '../../core/Image';

const MessageBubbleWrapper = styled('div', {
    maxWidth: '350px',
});

const MiscWrapper = styled('div', {});

const MediaWrapper = styled('div', {});

export const MessageBubble = forwardRef(({ 
    values, 
    isAuth,
    displayPhoto,
    friendDisplayPhoto,
}, ref) => {
    const messageBubbleRef = useRef('');
    const [message, setMessage] = useState('');
    const date = new Date();
    const createdAt = new Date(values.created_at.toDate());

    const handleMessage = message => setMessage(message);

    useEffect(() => {
        let loading = true;

        if (loading && values && (Object.keys(values).length > 0) && isAuth) {
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
            <MiscWrapper className={`d-flex ${((values.sender === auth.currentUser.uid) ? " flex-row" : " flex-row-reverse")}`}>
                <MiscWrapper className="flex-grow-1">
                {
                    (values.message) && 
                    <MiscWrapper css={{
                        background: '$lightGray1',
                        padding: '$space-2 $space-3 0px',
                        borderRadius: '$default',
                    }}>
                        <Text type="paragraph" css={{ marginBottom: '$space-2', }}>{values.message}</Text>
                    </MiscWrapper>
                }
                {
                    (values.images && Object.keys(values.images).length > 0) &&
                    <MiscWrapper className={`d-flex flex-column flex-sm-row justify-content-center align-items-center flex-wrap`} css={{
                        padding: '$space-2',
                        background: '$white',
                        borderRadius: '$small',
                        border: '2px 2px solid black',
                        maxWidth: '300px',
                        'img': {
                            margin: '$space-1',
                            borderRadius: '$small',
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                        },
                    }}>
                        {
                            Object.keys(values.images).map((i, val) => {
                                return <MediaWrapper key={i}>
                                    <Image src={Object.values(values.images)[val]} />
                                </MediaWrapper>
                            })
                        }
                    </MiscWrapper>
                }
                </MiscWrapper>
                <Image 
                src={`${((values.sender === auth.currentUser.uid) && displayPhoto) ? displayPhoto : 
                (friendDisplayPhoto) ? friendDisplayPhoto : "/avatar_medium.png"}`} 
                css={{ 
                    width: '35px',
                    height: '35px',
                    objectFit: 'cover',
                    borderRadius: '100%',
                    margin: (values.sender === auth.currentUser.uid) ? '0px 0px 0px $space-2' : '0px $space-2 0px 0px',
                 }}/>
            </MiscWrapper>
            <MiscWrapper className="d-flex flex-column align-self-center align-self-sm-end">
            {
                (values.created_at) && 
                <Text
                type="span"
                size="tiny"
                color="darkGray">
                    <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="fa-fw me-2" />
                {/* {
                    new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Asia/Manila',
                        hourCycle: 'h12',
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }).format(new Date(values.created_at.toDate()))
                } */}
                </Text>
            }
            {
                (values.readAt) && 
                <Text
                type="span"
                size="tiny"
                color="darkGray">
                    <Text
                    type="span"
                    size="tiny"
                    color="darkGray">
                    <FontAwesomeIcon icon={faBookOpen} className="fa-fw me-2" />
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
                            second: '2-digit',
                        }).format(new Date(values.readAt.toDate()))
                    }
                    </Text>
                </Text>
            }
            </MiscWrapper>
        </MessageBubbleWrapper>
    )
});

export default MessageBubble;
