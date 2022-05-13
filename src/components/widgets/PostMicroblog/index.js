import { useState, useEffect, } from 'react';
import { Form, Input, message, } from 'antd';
import { isAuth, key, showAlert, } from '../../../util';
import Cookies from 'js-cookie';
import { axiosInstance, } from '../../../requests'; 
import { styled } from "../../../stitches.config";

import Text from '../../core/Text';
import Button from '../../core/Button';

const PostMicroblogWrapper = styled('div', {
    'label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '35px',
        fontWeight: 'bold',
        fontSize: '$default',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea': {
        borderRadius: '$small',
        padding: '$space-3',
        border: 'unset',
    },
    '.ant-form-item-control-input-content > input, .ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper, .ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused': {
        border: '5px solid $black !important',
        borderRadius: '$default',
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

export const PostMicroblog = ({ microblogPosts, handleMicroblogPosts, }) => {
    const [form] = Form.useForm();
    const [help, setHelp] = useState('');

    const handleDescriptionChange = description => {
        // handleMicroblogPosts({ ...details, description: description });
        form.resetFields();
        setHelp('');
    }

    const onFinish = value => {
        const campDescForm = new FormData();

        if (isAuth()) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            for (let i in value) {
                value[i] && campDescForm.append(i, value[i]);
            }

            campDescForm.append('username', JSON.parse(Cookies.get('auth_user')).username);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "community/update-description", campDescForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

                .then(response => {
                    if (response.data.isSuccess) {
                        handleDescriptionChange(response.data.data.details);
                        showAlert();
                        setTimeout(() => {
                            message.success({
                                content: 'Community description updated.',
                                key,
                                duration: 2,
                                style: {
                                    marginTop: '10vh',
                                    zIndex: '999999',
                                }
                            });
                        }, 1000);
                    } else {
                        showAlert();
                        setTimeout(() => {
                            message.info({
                                content: response.data.data.errorText,
                                key,
                                duration: 2,
                                style: {
                                    marginTop: '10vh',
                                    zIndex: '999999',
                                }
                            });
                        }, 1000);
                    }
                })

                .catch(err => {
                    if (err.response && err.response.data.errors) {
                        setHelp(<Text type="span" color="red">{err.response.data.errors.description[0]}</Text>);
                    }
                });
        } else {
            console.log('on camp description: no cookies');
        }
    }

    return (
        <PostMicroblogWrapper>
            <Form
            name="microblog-form"
            // className="bg-warning"
            layout="vertical"
            validateMessages={validateMessages}
            onFinish={onFinish}
            autoComplete="off">
                <Form.Item
                label="Microblog"
                name="body"
                {...help && { help: help }}
                rules={[{
                    required: true,
                    type: 'string',
                    min: 2,
                    max: 300,
                }]}>
                    <Input.TextArea
                    allowClear
                    maxLength={300}
                    rows={5}
                    showCount />
                </Form.Item>

                <SubmitButtonWrapper className="d-flex justify-content-md-end align-items-center">
                    <Button
                    type="submit"
                    text="Post"
                    className="flex-grow-1 flex-md-grow-0"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </PostMicroblogWrapper>
    )
}

export default PostMicroblog;