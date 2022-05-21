import { useState, } from "react";
import { useOutletContext, useNavigate, } from "react-router-dom";
import { Form, Input, message, } from "antd";
import { key, showAlert, } from "../../../util";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, } from '@fortawesome/free-solid-svg-icons';
import { styled, richTextStyle, } from "../../../stitches.config";

import Button from "../../core/Button";
import Heading from "../../core/Heading";
import Alert from "../../core/Alert";
import Text from "../../core/Text";
import { TipTapEditor, } from "../TipTapEditor";
import JournalEntryPreview from "../JournalEntryPreview";

const PostJournalWrapper = styled('div', {
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

const SubmitButtonWrapper = styled('div', {});

const PreviewWrapper = styled('div', richTextStyle);

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
    const context = useOutletContext();

    const [form] = Form.useForm();
    const [titleHelp, setTitleHelp] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [output, setOutput] = useState('');
    const [help, setHelp] = useState('');
    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');

    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleHelp = help => setHelp(help);
    const handleTitleHelp = titleHelp => setTitleHelp(titleHelp);

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
            // className="bg-warning"
            validateMessages={validateMessages}
            onFinish={onFinish}
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
                    text={showPreview ? 'Go back' : 'Show preview'}
                    className="flex-grow-1 flex-md-grow-0"
                    onClick={() => handleTogglePreview()} />
                    <Button
                    type="submit"
                    text="Post"
                    className="flex-grow-1 flex-md-grow-0 mt-3 mt-md-0"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        {
            (showPreview && (output && (Object.keys(output).length > 0)) && limit) &&
            <JournalEntryPreview 
            title={form.getFieldsValue().title}
            content={output} 
            limit={limit}
            isTitleShown
            isEditable={false} />
        }
        </PostJournalWrapper>
    )
}

export default PostJournal;