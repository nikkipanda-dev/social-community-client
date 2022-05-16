import { useState, useEffect, } from 'react';
import { Form, Input, message, } from 'antd';
import { isAuth, key, showAlert, } from '../../../util';
import Cookies from 'js-cookie';
import { axiosInstance } from '../../../requests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleInfo, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Text from '../../core/Text';
import Button from '../../core/Button';

const UpdateMicroblogWrapper = styled('div', {
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

export const UpdateMicroblog = ({ 
    values, 
    handleValues,
    handleHideModal,
}) => {
    const [form] = Form.useForm();
    const [help, setHelp] = useState('');

    const [initialValues, setInitialValues] = useState({});

    const handleInitialValues = initialValues => setInitialValues(initialValues);

    const onFinish = value => {
        const microblogForm = new FormData();

        if (isAuth() && (values && values.slug)) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            for (let i in value) {
                value[i] && microblogForm.append(i, value[i]);
            }

            microblogForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            microblogForm.append('slug', values.slug);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "microblog-entries/user/entry/update", microblogForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleValues({...values, body: response.data.data.details.body});
                    showAlert();
                    handleHideModal();
                    setTimeout(() => {
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
                        message.open({
                            content: <><Text type="span"><FontAwesomeIcon
                                icon={faCircleInfo}
                                className="me-2"
                                style={{ color: '#666666', }} /> {response.data.data.errorText}</Text></>,
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
            console.log('on update microblog: no cookies');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading && (values && Object.keys(values).length > 0)) {
            handleInitialValues({
                body: values.body,
            });
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <UpdateMicroblogWrapper>
        {
            (initialValues && (Object.keys(initialValues).length > 0)) && 
            <Form
            name="microblog-form"
            form={form}
            initialValues={initialValues}
            layout="vertical"
            validateMessages={validateMessages}
            onFinish={onFinish}>
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
                    rows={2}
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
        }
        </UpdateMicroblogWrapper>
    )
}

export default UpdateMicroblog;