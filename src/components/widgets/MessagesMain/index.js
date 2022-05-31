import { 
    useState, 
    useEffect, 
    useRef,
} from "react";
import { styled } from "../../../stitches.config";
import { Form, } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, } from "@fortawesome/free-solid-svg-icons";

import PostMessage from "../PostMessage";
import Text from "../../core/Text";
import MessagesContainer from "../MessagesContainer";

const MessagesMainWrapper = styled('div', {});

const MessagesContainerWrapper = styled('div', {});

const MessagesTextareaWrapper = styled('div', {
    '.emoji-toggler:hover': {
        cursor: 'pointer',
    },
});

export const MessagesMain = ({ storeFn, isAuth, }) => {
    const textareaRef = useRef('');
    const [form] = Form.useForm();
    const emojiRef = useRef('');
    const emojiTogglerRef = useRef('');

    const [isEmojiShown, setIsEmojiShown] = useState(false);
    const [emoji, setEmoji] = useState('');
    const [message, setMessage] = useState('');

    const handleToggleEmoji = () => setIsEmojiShown(!(isEmojiShown));
    const handleEmoji = emoji => setEmoji(emoji);
    const handleMessage = message => setMessage(message);

    const messages = [
        {
            id: 1,
            first_name: "Jane",
            last_name: "Doe",
            message: "Hello",
            username: "janedoe",
            created_at: new Date(),
        },
        {
            id: 2,
            first_name: "Jane",
            last_name: "Doe",
            message: "Hey",
            username: "janedoe",
            created_at: new Date(),
        },
        {
            id: 3,
            first_name: "Jane",
            last_name: "Doe",
            message: "Sup",
            username: "janedoe",
            created_at: new Date(),
        },
        {
            id: 4,
            first_name: "Jane",
            last_name: "Doe",
            message: "Waddup",
            username: "janedoe",
            created_at: new Date(),
        },
        {
            id: 5,
            first_name: "Nikki",
            last_name: "Dummy",
            message: "hello",
            username: "spectralsightings",
            created_at: new Date(),
        },
    ];

    const onEmojiClick = (event, emojiObject) => {
        console.log(emojiObject);
        console.info('form vals ', form.getFieldsValue());
        handleMessage((form.getFieldsValue().message ? form.getFieldsValue().message : '') + emojiObject.emoji);
    };

    useEffect(() => {
        let loading = true;

        if (loading) {
            console.log('emoji', emoji);
        }

        return () => {
            loading = false;
        }
    }, [emoji]);

    useEffect(() => {
        let loading = true;

        if (loading) {
            form.setFieldsValue({message: message});
        }

        return () => {
            loading = false;
        }
    }, [message]);
    
    return (
        <MessagesMainWrapper>
            <MessagesContainerWrapper>
                <MessagesContainer messages={messages} isAuth={isAuth} />
            </MessagesContainerWrapper>
            <MessagesTextareaWrapper className="d-flex">
                <Text 
                type="span" 
                color="darkGray"
                className="emoji-toggler"
                css={{ marginTop: '$space-2', }}
                onClick={() => handleToggleEmoji()}><FontAwesomeIcon icon={faFaceSmile} className="fa-fw fa-2xl me-2" /></Text>
                <PostMessage 
                storeFn={storeFn} 
                ref={emojiRef}
                onEmojiClick={onEmojiClick}
                isEmojiShown={isEmojiShown}
                className="flex-grow-1"
                isAuth={isAuth} 
                form={form} />
            </MessagesTextareaWrapper>
        </MessagesMainWrapper>
    )
}

export default MessagesMain;