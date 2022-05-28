import { 
    useState, 
    useEffect, 
    useRef,
} from "react";
import TipTapEditor from "../TipTapEditor";
import { 
    useParams, 
    useOutletContext,
    useNavigate,
} from "react-router-dom";
import Cookies from 'js-cookie';
import { 
    Form, 
    Input, 
    message,
} from "antd";
import { axiosInstance } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleCheck,
    faCircleInfo,
    faTrash,
    faPencil,
    faBan,
    faCaretLeft,
    faFlag,
} from '@fortawesome/free-solid-svg-icons';
import { key, showAlert, } from "../../../util";
import { richTextStyle, } from "../../../stitches.config";
import { styled } from "../../../stitches.config";

import Heading from "../../core/Heading";
import Text from "../../core/Text";
import Button from "../../core/Button";
import Modal from "../Modal";
import Alert from "../../core/Alert";
import Image from "../../core/Image";
import ImagesPreview from "../ImagesPreview";
import CommunityBlogEntryReplies from "../CommunityBlogEntryComments";
import CommunityBlogEntrySupporters from "../CommunityBlogEntrySupporters";

const CommunityBlogEntryWrapper = styled('div', {
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
    'a': {
        textDecoration: 'unset',
        color: '$pineGreen',
    },
    'a:hover': {
        color: '$darkGray',
    },
});

const CommunityBlogContentWrapper = styled('div', {
    marginTop: '$space-4',
});

const MiscWrapper = styled('div', {});

const CommunityBlogMiscWrapper = styled('div', {});

const ActionWrapper = styled('div', {
    marginTop: '0px',
    '> button:nth-child(n+2)': {
        marginLeft: '$space-2',
    },
    '@media screen and (max-width: 575px)': {
        marginTop: '$space-3',
        '> button:nth-child(n+2)': {
            marginLeft: '0px',
        },
    },
});

const CommunityBlogHeaderWrapper = styled('div', {});

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

export const CommunityBlogEntry = () => {
    const params = useParams();
    const ref = useRef('');
    const context = useOutletContext();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const limit = 10000;

    const [forceRender, setForceRender] = useState(false);
    const [values, setValues] = useState('');
    const [output, setOutput] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [files, setFiles] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [isTitleShown, setIsTitleShown] = useState(true);
    const [titleHelp, setTitleHelp] = useState('');
    const [bodyHelp, setBodyHelp] = useState('');
    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');
    const [help, setHelp] = useState('');

    const handleForceRender = () => setForceRender(!(forceRender));
    const handleValues = values => setValues(values);
    const handleImageUrls = imageUrls => setImageUrls(imageUrls);
    const handleFiles = files => setFiles(files);
    const handleOutput = output => setOutput(output);
    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleHelp = help => setHelp(help);
    const handleTitleHelp = titleHelp => setTitleHelp(titleHelp);
    const handleBodyhelp = bodyHelp => setBodyHelp(bodyHelp);

    const handleShowModal = () => {
        handleStatus('warning');
        handleHeader('Confirmation');
        handleHelp(<Text type="span">You are about to delete this community blog entry. Continue?</Text>);
        setIsVisible(true);
    }

    const handleHideModal = () => {
        handleHelp('');
        setIsVisible(false);
    }

    const handleNavigator = () => {
        navigate("../");
    }

    const handleToggleEdit = () => {
        form.resetFields();
        setIsEditable(!isEditable);
        setIsTitleShown(!isTitleShown);
    }

    const handleSubmitPost = () => {
        handleToggleEdit();
    }

    const onFinish = value => {
        handleTitleHelp('');
        handleBodyhelp('');
        handleHelp('');

        if (!(context.isAuth)) {
            console.log('on update journal: no cookies');
            return;
        }

        if (!(values.body) && !(output)) {
            console.log('on update blog: body empty');
            return;
        }

        if (values && values.slug && values.body) {
            const updateForm = new FormData();

            for (let i in value) {
                value[i] && updateForm.append(i, value[i]);
            }

            if (files && (Object.keys(files).length > 0)) {
                let ctr = 0;

                for (let i of files) {
                    ++ctr;

                    updateForm.append(`images[${ctr}]`, i);
                }
            }

            updateForm.append('slug', values.slug);
            updateForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            updateForm.append('body', (output && (Object.keys(output).length > 0)) ? JSON.stringify(output) : values.body);

            updateEntry(updateForm).then(response => {
                handleSubmitPost();
                showAlert();

                if (!(response.data.isSuccess)) {
                    setTimeout(() => {
                        handleValues(response.data.data.details);
                        message.open({
                            content: <>
                                <FontAwesomeIcon icon={faCircleInfo} className="fa-fw me-2" />
                                <Text type="span">{response.data.data.errorText}</Text>
                            </>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);

                    return;
                }

                setTimeout(() => {
                    handleValues(response.data.data.details);
                    message.open({
                        content: <>
                            <FontAwesomeIcon 
                            icon={faCircleCheck} 
                            className="fa-fw me-2"
                            style={{ color: '#007B70', }} />
                            <Text type="span">Updated.</Text>
                        </>,
                        key,
                        duration: 2,
                        style: {
                            marginTop: '25vh',
                            zIndex: '999999',
                        }
                    });
                }, 1000);
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    handleTitleHelp(<Text type="span" color="red">{err.response.data.errors.title[0]}</Text>);
                    handleBodyhelp(<Text type="span" color="red">{err.response.data.errors.body[0]}</Text>)
                }
            });
        }
    }

    const onRemove = () => {
        if (!(context.isAuth)) {
            console.log('on remove journal: no cookies');
            return;
        }

        if (params.slug) {
            const deleteForm = new FormData();
            deleteForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            deleteForm.append('slug', params.slug);

            removeEntry(deleteForm).then(response => {
                if (!(response.data.isSuccess)) {
                    handleStatus('info');
                    handleHeader('Alert');
                    handleHelp(<Text>{response.data.data.errorText}</Text>)
                    return;
                }

                handleStatus('success');
                handleHeader('Blog entry deleted');
                handleHelp(<Text type="span">Going back...</Text>)

                setTimeout(() => {
                    navigate("/community-blog", { replace: true });
                }, 1000);
            })
        }
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

    const handleRemoveImage = name => {
        handleFiles(Object.values(files).filter(file => file.name !== name));
        handleImageUrls(Object.values(imageUrls).filter(imageUrl => imageUrl.name !== name));
    }

    useEffect(() => {
        let loading = true;

        if (!(context.isAuth)) {
            console.error('on get entry: no cookies');
            return;
        }

        if (loading && params.slug) {
            getEntry(params.slug).then(response => {
                console.log(response.data);
                if (!(response.data.isSuccess)) {
                    console.error('err get entry ', response.data.data.errorText);
                    return;
                }

                handleValues(response.data.data.details);
            })

            .catch(err => {
                console.error('err get entry ', err.response && err.response.data.errors);
            });
        }

        return () => {
            loading = false;
        }
    }, []);

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
        (context.isAuth && values && values.slug) && 
        <CommunityBlogEntryWrapper>
            <MiscWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                <Button
                type="button"
                text={<Text type="span"><FontAwesomeIcon icon={faCaretLeft} className="fa-fw" />Go back</Text>}
                className="flex-grow-1 flex-sm-grow-0"
                onClick={() => handleNavigator()} />
                <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                    <Button
                    type="button"
                    text={<Text type="span"><FontAwesomeIcon icon={isEditable ? faBan : faPencil } className="fa-fw me-1" />{isEditable ? "Cancel" : "Edit"}</Text>}
                    color={isEditable ? '' : "orange"}
                    className="flex-grow-1 flex-sm-grow-0"
                    onClick={() => handleToggleEdit()} />
                    <Button
                    type="button"
                    text={<Text type="span"><FontAwesomeIcon icon={faTrash} className="fa-fw me-1" />Delete</Text>}
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                    color="red"
                    onClick={() => handleShowModal()} />
                    <Button
                    type="button"
                    text={<Text type="span"><FontAwesomeIcon icon={faFlag} className="fa-fw me-1" /></Text>}
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0 button-plain-red"
                    color="transparent"
                    onClick={() => handleShowModal()} />
                </ActionWrapper>
            </MiscWrapper>
        {
            (isTitleShown && !(isEditable)) && 
            <CommunityBlogContentWrapper>
                <CommunityBlogHeaderWrapper className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-center align-items-lg-start">
                    <Heading type={5} text={(values && values.title)} />
                    <Text type="span" css={{ margin: '$space-2 0px', }}>
                    {
                        (values && values.created_at) &&
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
                </CommunityBlogHeaderWrapper>
                <PreviewWrapper>
                {
                    (values && (Object.keys(values.blog_entry_images).length > 0)) && 
                    <ImagesPreview 
                    images={Object.values(values.blog_entry_images) } 
                    bodyClassName="p-1 d-flex flex-wrap justify-content-center align-items-center" />
                }
                {
                    (values && values.body) &&
                    <TipTapEditor
                    content={(values && values.body) && JSON.parse(values.body)}
                    isEditable={false}
                    limit={limit} />   
                }
                </PreviewWrapper>
            </CommunityBlogContentWrapper>
        }
        {
            (isEditable && values && values.title && values.slug) && 
            <CommunityBlogContentWrapper>
                <Form
                name="blog-form"
                form={form}
                validateMessages={validateMessages}
                onFinish={onFinish}
                initialValues={{ title: values.title }}
                {...formItemLayout}>
                {
                    !(isTitleShown) &&
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
                    </>
                }
                <PreviewWrapper>
                    <TipTapEditor
                    content={(values && values.body) && JSON.parse(values.body)}
                    isEditable={true}
                    limit={limit}
                    handleOutput={handleOutput} />
                    <Text type="span" color="red">{bodyHelp}</Text>
                </PreviewWrapper>
                {
                    isEditable &&
                    <Button
                    type="submit"
                    text="Save"
                    color="brown" />
                }
                </Form>
            </CommunityBlogContentWrapper>
        }
            <CommunityBlogMiscWrapper className="d-flex flex-column flex-xl-row">
                <MiscWrapper css={{ flex: '60%', padding: '$space-3', }}>
                    <CommunityBlogEntryReplies isAuth={context.isAuth} slug={(values && values.slug)} />
                </MiscWrapper>
                <MiscWrapper css={{
                    flex: '40%', 
                    background: '$lightGray',
                    borderRadius: '$default', 
                    padding: '$space-3',
                }}>
                    <CommunityBlogEntrySupporters isAuth={context.isAuth} />
                </MiscWrapper>
            </CommunityBlogMiscWrapper>
            <Modal 
            isVisible={isVisible}
            closable={false} 
            maskClosable={true}
            onCancel={handleHideModal}>
            {
                <Alert 
                status={status} 
                icon 
                header={header}>
                    {help}
                </Alert>   
            }
                <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center" css={{ marginTop: '$space-3', }}>
                    <Button
                    type="button"
                    text="Cancel"
                    className="flex-grow-1 flex-sm-grow-0"
                    onClick={() => onRemove()} />
                    <Button
                    type="button"
                    text="Delete"
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                    color="red"
                    onClick={() => onRemove()} />
                </ActionWrapper>
            </Modal>
        </CommunityBlogEntryWrapper>
    )
}

async function getEntry(slug) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "blog-entries/get-entry", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
            slug: slug,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function updateEntry(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "blog-entries/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function removeEntry(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "blog-entries/destroy", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default CommunityBlogEntry;