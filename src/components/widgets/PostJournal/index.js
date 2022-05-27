import { 
    useState, 
    useEffect, 
    useRef,
} from "react";
import { useOutletContext, useNavigate, } from "react-router-dom";
import { Form, Input, message, } from "antd";
import { key, showAlert, } from "../../../util";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCaretLeft, } from '@fortawesome/free-solid-svg-icons';
import { styled, richTextStyle, } from "../../../stitches.config";

import Button from "../../core/Button";
import Image from "../../core/Image";
import Alert from "../../core/Alert";
import Text from "../../core/Text";
import { TipTapEditor, } from "../TipTapEditor";
import JournalEntryPreview from "../JournalEntryPreview";

const PostJournalWrapper = styled('div', {
    '.ant-col > label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '$space-2',
        fontSize: '$default',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper > input, div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper, div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused': {
        outline: 'unset',
        boxShadow: 'unset !important',
        border: 'unset',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper': {
        border: '1px solid $lightGray1 !important',
        padding: '$space-2',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused': {
        border: '1px solid $lightGray2 !important',
    },
});

const SubmitButtonWrapper = styled('div', {});

const PreviewWrapper = styled('div', richTextStyle);

const ImageWrapper = styled('div', {});

const validateMessages = {
    required: '${label} is required.',
    string: {
        range: "${label} must be at least ${min} and maximum of ${max} characters.",
    }
};

const formItemLayout = {
    labelCol: {
        span: 24,
        md: { span: 4, },
        lg: { span: 3, },
    },
    wrapperCol: {
        span: 24, 
        md: { span: 24, },
    },
}

export const PostJournal = () => {
    const navigate = useNavigate();
    const ref = useRef('');
    const context = useOutletContext();

    const [forceRender, setForceRender] = useState(false);
    const [form] = Form.useForm();
    const [files, setFiles] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [title, setTitle] = useState('');
    const [titleHelp, setTitleHelp] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [output, setOutput] = useState('');
    const [help, setHelp] = useState('');
    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');

    const handleForceRender = () => setForceRender(!(forceRender));
    const handleImageUrls = imageUrls => setImageUrls(imageUrls);
    const handleFiles = files => setFiles(files);
    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleHelp = help => setHelp(help);
    const handleTitleHelp = titleHelp => setTitleHelp(titleHelp);
    const handleTitleChange = title => setTitle(title);

    const onValuesChange = (changedVal, _) => {
        handleTitleChange(changedVal.title);
    }

    const handleTogglePreview = () => {
        setShowPreview(!showPreview);
        context.handleToggleJournalNav();
    }

    const handleOutput = output => setOutput(output);

    const handleSubmitPost = slug => {
        navigate('../' + slug);
    }

    const limit = 10000;

    const onFinish = value => {
        handleTitleHelp('');
        handleHelp('');

        if (context.isAuth) {
            if (!(output) && !(output.content)) {
                handleHelp("Journal entry cannot be empty.");
                return;
            }

            const journalForm = new FormData();

            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            for (let i in value) {
                value[i] && journalForm.append(i, value[i]);
            }

            if (files && (Object.keys(files).length > 0)) {
                let ctr = 0;

                for (let i of files) {
                    ++ctr;

                    journalForm.append(`images[${ctr}]`, i);
                }
            }

            journalForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            journalForm.append('body', JSON.stringify(output));

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "journal-entries/user/store", journalForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    showAlert();
                    setTimeout(() => {
                        handleSubmitPost(response.data.data.details.slug);
                        message.open({
                            content: <>
                                <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="me-2"
                                style={{ color: '#007B70', }} />
                                <Text type="span">Posted.</Text>
                            </>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
                } else {
                    showAlert();
                    setTimeout(() => {
                        message.info({
                            content: <Text type="span">{response.data.data.errorText}</Text>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors && err.response.data.errors.body) {
                    setHelp(<Text type="span" color="red">{err.response.data.errors.body[0]}</Text>);
                }
            });
        } else {
            console.log('on post journal: no cookies');
        }
    }

    const handleRemoveImage = name => {
        handleFiles(Object.values(files).filter(file => file.name !== name));
        handleImageUrls(Object.values(imageUrls).filter(imageUrl => imageUrl.name !== name));
    }

    const handleImageChange = () => {
        if (ref.current.files.length > 0) {
            for (let i of ref.current.files) {
                if (i.size > (2 * 1024 * 1024)) {
                    console.log("too large ");
                    return;
                }
            }

            handleFiles(ref.current.files);
            handleForceRender();
        }
    }

    useEffect(() => {
        let loading = true;
        let array = [];

        if (loading && (Object.keys(files).length > 0)) {
            for (let i of files) {
                console.log(i);
                array.push({ src: URL.createObjectURL(i), name: i.name });
            }

            console.log('arra ', array);
            handleImageUrls(array);
        }

        return () => {
            if (array.length > 0) {
                for (let i of array) {
                    URL.revokeObjectURL(i);
                }
            }

            loading = false;
        }
    }, [forceRender]);

    return (
        <PostJournalWrapper>
        {
            help && 
            <Alert 
            status={status} 
            icon 
            header={header}>
                {help}
            </Alert>
        }
            <Form
            name="journal-form"
            form={form}
            validateMessages={validateMessages}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            {...formItemLayout}
            autoComplete="off">
            {
                !(showPreview) && 
                <>
                    <Form.Item
                    label="Title"
                    name="title"
                    {...titleHelp && { help: titleHelp }}
                    rules={[{
                        required: true,
                        type: 'string',
                        min: 2,
                        max: 50,
                    }]}>
                        <Input allowClear />
                    </Form.Item>
                    <input
                    name="images[]"
                    type="file"
                    accept="image/*"
                    ref={ref}
                    multiple
                    onChange={() => handleImageChange()} />
                    {
                        (imageUrls && (Object.keys(imageUrls).length > 0)) &&
                        Object.keys(imageUrls).map((i, val) => {
                            return (
                                <ImageWrapper key={i}>
                                    <Image src={Object.values(imageUrls)[val].src} css={{
                                        width: '150px',
                                        height: '150px',
                                        objectFit: 'cover',
                                    }} />
                                    <Button
                                    type="button"
                                    text="Remove"
                                    onClick={() => handleRemoveImage(Object.values(imageUrls)[val].name)} />
                                </ImageWrapper>
                            )
                        })
                    }
                    <PreviewWrapper>
                        <TipTapEditor
                        limit={limit}
                        content={output}
                        handleOutput={handleOutput}
                        isEditable />   
                    </PreviewWrapper>
                </>
            }

                <SubmitButtonWrapper className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center" css={{ marginTop: showPreview ? '0' : '$space-3' }}>
                    <Button
                    type="button"
                    text={showPreview ? <Text type="span"><FontAwesomeIcon icon={faCaretLeft} className="fa-fw" />Go back</Text> : 'Show preview'}
                    className="flex-grow-1 flex-md-grow-0"
                    onClick={() => handleTogglePreview()} />
                    {
                        !(showPreview) && 
                        <Button
                        type="submit"
                        text="Post"
                        className="flex-grow-1 flex-md-grow-0 mt-3 mt-md-0"
                        color="brown" />
                    }
                </SubmitButtonWrapper>
            </Form>
        {
            (showPreview) &&
            <JournalEntryPreview 
            title={(title && (title.length > 0)) ? title : "Your Title Here"}
            content={output} 
            limit={limit}
            isTitleShown
            isEditable={false} />
        }
        </PostJournalWrapper>
    )
}

export default PostJournal;