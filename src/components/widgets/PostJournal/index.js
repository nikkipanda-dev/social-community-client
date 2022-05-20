import { useState, } from "react";
import { useOutletContext, } from "react-router-dom";
import { Form, Input, message, } from "antd";
import { key, showAlert, } from "../../../util";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";
import Alert from "../../core/Alert";
import Text from "../../core/Text";
import { TipTapEditor, } from "../TipTapEditor";

const PostJournalWrapper = styled('div', {
    background: '$lightGray ',
    marginBottom: '$space-5',
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
    marginTop: '30px',
});

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
    const context = useOutletContext();

    const [form] = Form.useForm();
    const [titleHelp, setTitleHelp] = useState('');
    const [output, setOutput] = useState('');
    const [help, setHelp] = useState('');
    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');

    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleHelp = help => setHelp(help);
    const handleTitleHelp = titleHelp => setTitleHelp(titleHelp);
    const handleOutput = output => setOutput(output);

    const limit = 10000;

    console.log('json ', output);

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

            console.log('body ', output);

            for (let [i, val] of journalForm.entries()) {
                console.info('i ', i);
                console.info('val ', val);
            }

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "journal-entries/user/store", journalForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                console.log('res ', response.data);
                if (response.data.isSuccess) {
                    showAlert();
                    setTimeout(() => {
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

                <TipTapEditor 
                limit={limit} 
                handleOutput={handleOutput}
                isEditable />

                <SubmitButtonWrapper className="d-flex justify-content-md-end align-items-center">
                    <Button
                    type="submit"
                    text="Post"
                    className="flex-grow-1 flex-md-grow-0"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </PostJournalWrapper>
    )
}

export default PostJournal;