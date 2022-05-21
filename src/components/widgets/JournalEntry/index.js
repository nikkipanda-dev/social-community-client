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
import DeleteJournalEntry from "../DeleteJournalEntry";

const JournalEntryWrapper = styled('div', {
    '.ant-col > label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '$space-3',
        fontSize: '$default',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper, div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper:hover': {
        borderStyle: 'solid',
        borderWidth: '0 0 1px',
        borderColor: '$lightGray2',
        boxShadow: 'unset !important',
        padding: '$space-3',
    },
});

const SubmitButtonWrapper = styled('div', {
    marginTop: '$space-3',
});

const JournalEntryContentWrapper = styled('div', {
    marginTop: '$space-4',
});

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
    const context = useOutletContext();
    const ref = useRef('');

    console.log('isauth ', context);

    const [values, setValues] = useState('');
    const [output, setOutput] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [isTitleShown, setIsTitleShown] = useState(true);
    const [help, setHelp] = useState('');
    const [titleHelp, setTitleHelp] = useState('');
    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');

    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleValues = values => setValues(values);
    const handleOutput = output => setOutput(output);
    const handleHelp = help => setHelp(help);
    const handleTitleHelp = titleHelp => setTitleHelp(titleHelp);
    const handleShowModal = () => setIsVisible(true);
    const handleHideModal = () => setIsVisible(false);

    const limit = 10000;

    console.log('val', values);

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
                    console.log(response.data.data.errorText);
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

        if (context.isAuth && (values && values.slug && values.body)) {
            const journalForm = new FormData();

            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            for (let i in value) {
                value[i] && journalForm.append(i, value[i]);
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
                        handleValues(response.data.data.details);
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

    useEffect(() => {
        let loading = true;

        if (loading) {
            getJournalEntry();
        }

        return () => {
            loading = false;
        }
    }, []);

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
                text={<FontAwesomeIcon icon={faTrash} />}
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
            // className="bg-warning"
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
                </>
            }
            {
                (values && values.body && values.title && values.created_at) &&
                <JournalEntryPreview
                content={values.body}
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