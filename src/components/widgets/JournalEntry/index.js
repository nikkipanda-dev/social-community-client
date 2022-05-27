import { 
    useState, 
    useEffect, 
    useRef,
} from "react";
import { useParams, useOutletContext, } from "react-router-dom";
import Cookies from 'js-cookie';
import { Form, Input, message, } from "antd";
import { axiosInstance } from "../../../requests";
import { key, showAlert, } from "../../../util";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleCheck, 
    faTrash,
    faPencil,
    faBan,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";
import JournalEntryPreview from "../JournalEntryPreview";
import Text from "../../core/Text";
import Alert from "../../core/Alert";
import Modal from "../Modal";
import Image from "../../core/Image";
import DeleteJournalEntry from "../DeleteJournalEntry";

const JournalEntryWrapper = styled('div', {
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

const SubmitButtonWrapper = styled('div', {
    marginTop: '$space-3',
});

const JournalEntryContentWrapper = styled('div', {
    marginTop: '$space-4',
});

const ImageWrapper = styled('div', {});

const ActionWrapper = styled('div', {});

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

export const JournalEntry = () => {
    const [form] = Form.useForm();
    const params = useParams();
    const ref = useRef('');
    const context = useOutletContext();

    const [forceRender, setForceRender] = useState(false);
    const [files, setFiles] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [values, setValues] = useState('');
    const [output, setOutput] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [isTitleShown, setIsTitleShown] = useState(true);
    const [help, setHelp] = useState('');
    const [titleHelp, setTitleHelp] = useState('');
    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');
    
    const handleForceRender = () => setForceRender(!(forceRender));
    const handleImageUrls = imageUrls => setImageUrls(imageUrls);
    const handleFiles = files => setFiles(files);
    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleValues = values => setValues(values);
    const handleOutput = output => setOutput(output);
    const handleHelp = help => setHelp(help);
    const handleTitleHelp = titleHelp => setTitleHelp(titleHelp);
    const handleShowModal = () => setIsVisible(true);
    const handleHideModal = () => setIsVisible(false);

    const limit = 10000;

    const handleToggleEdit = () => {
        form.resetFields();
        setIsEditable(!isEditable);
        setIsTitleShown(!isTitleShown);
    }

    const handleSubmitPost = () => {
        handleToggleEdit();
    }

    const getJournalEntry = () => {
        if (context.isAuth) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "journal-entries/user/get-entry", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                    slug: params.slug,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleValues({...response.data.data.details, body: JSON.parse(response.data.data.details.body)});
                } else {
                    console.error(response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err profile journal', err.response.data.errors);
                }
            });
        } else {
            console.log('on journal entry: no cookies');
        }
    }

    const onFinish = value => {
        handleTitleHelp('');
        handleHelp('');

        if (!(values.body) && !(output)) {
            console.log('on update journal: body empty');
            return;
        }

        if (context.isAuth && (values && values.slug && values.body)) {
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
            journalForm.append('body', (output && (Object.keys(output).length > 0)) ? JSON.stringify(output) : JSON.stringify(values.body));
            journalForm.append('slug', values.slug);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "journal-entries/user/update", journalForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    showAlert();
                    setTimeout(() => {
                        handleValues({ ...response.data.data.details, body: JSON.parse(response.data.data.details.body) });
                        handleSubmitPost();
                        message.open({
                            content: <>
                                <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="me-2"
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
                if (err.response && err.response.data.errors) {
                    handleTitleHelp(<Text type="span" color="red">{err.response.data.errors.title[0]}</Text>);
                    handleHelp(<Text type="span" color="red">{err.response.data.errors.body[0]}</Text>)
                }
            });
        } else {
            console.log('on update journal: no cookies');
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

        if (loading) {
            getJournalEntry();
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

    console.log('values ', values);

    return (
        (context.isJournalShown && (values && values.title)) &&
        <JournalEntryWrapper className="d-flex flex-column">
            <ActionWrapper className="align-self-md-end d-flex flex-column flex-md-row">
                <Button 
                type="button" 
                text={isEditable ? <Text type="span"><FontAwesomeIcon icon={faBan} className="me-1 fa-fw" />Cancel</Text> : <Text type="span"><FontAwesomeIcon icon={faPencil} className="me-1 fa-fw" />Edit</Text>}
                color={isEditable ? '' : 'orange'}
                className="align-self-md-end flex-grow-1 flex-md-grow-0"
                onClick={() => handleToggleEdit()}/>
                <Button
                type="button"
                text={<Text type="span"><FontAwesomeIcon icon={faTrash} />Delete</Text>}
                color="red"
                className="align-self-md-end flex-grow-1 flex-md-grow-0 ms-0 ms-md-2 mt-3 mt-md-0"
                onClick={() => handleShowModal()} />
            </ActionWrapper>
            <JournalEntryContentWrapper>
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
            initialValues={{ title: values.title }}
            {...formItemLayout}
            autoComplete="off">
            {
                (isEditable && !(isTitleShown)) &&
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
            {
                (values && values.body && values.title && values.created_at) &&
                <JournalEntryPreview
                content={values.body}
                images={(values && values.journal_entry_images) && values.journal_entry_images}
                date={values.created_at}
                limit={limit}
                isTitleShown={isTitleShown}
                title={values.title}
                handleOutput={handleOutput}
                isEditable={isEditable} />
            }
            {
                (isEditable) &&
                <SubmitButtonWrapper className="d-flex flex-column flex-md-row justify-content-md-end align-items-md-center">
                    <Button
                    type="submit"
                    text="Post"
                    className="flex-grow-1 flex-md-grow-0 mt-3 mt-md-0"
                    color="brown" />
                </SubmitButtonWrapper>
            }
            </Form>
            </JournalEntryContentWrapper>
            <Modal
            closable={false}
            maskClosable
            isVisible={isVisible}
            onCancel={handleHideModal}>
                <DeleteJournalEntry 
                onCancel={handleHideModal} 
                slug={(values && values.slug) && values.slug}
                title={(values && values.title) && values.title}
                isAuth={context.isAuth} />
            </Modal>
        </JournalEntryWrapper>
    )
}

export default JournalEntry;