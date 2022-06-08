import { useNavigate, } from 'react-router-dom';
import { useState, useEffect, } from 'react';
import { message, Form, Input, Checkbox, } from 'antd';
import Cookies from 'js-cookie';
import { key, showAlert } from '../../../util';
import { axiosInstance } from '../../../requests';
import { styled } from "../../../stitches.config";

import Button from '../../core/Button';
import Text from '../../core/Text';
import Alert from '../../core/Alert';

const LoginWrapper = styled('div', {
    'div.ant-row:nth-child(n+2)': {
        marginTop: '$space-3',
    },
    'label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '$space-4',
        fontWeight: 'bold',
        fontSize: '$default',
    },
    '.ant-form-item-control-input-content > input, .ant-form-item-control-input-content > span.ant-input-affix-wrapper, .ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused': {
        border: '5px solid $black !important',
        borderRadius: '$default',
        boxShadow: 'unset !important',
        padding: '$space-3',
    },
});

const SubmitButtonWrapper = styled('div', {});

const validateMessages = {
    required: '${label} is required.',
    types: {
        email: 'Please input a valid email address.',
    },
    string: {
        range: "${label} must be at least ${min} and maximum of ${max} characters.",
    }
};

const formItemLayout = {
    labelCol: {
        sm: { span: 7, },
    },
    wrapperCol: {
        sm: { span: 24, offset: 1, },
    },
}

export const Login = ({
    isAuth, 
    handleLogIn, 
    handleHideModal,
}) => {
    const navigate = useNavigate();

    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');
    const [alert, setAlert] = useState('');
    const [emailHelp, setEmailHelp] = useState('');
    const [passwordHelp, setPasswordHelp] = useState('');
    const [details, setDetails] = useState('');

    const handleDetails = details => setDetails(details);

    const resetAlerts = () => {
        setAlert('');
        setEmailHelp('');
        setPasswordHelp('');
    }

    const onFinish = values => {
        resetAlerts();

        const loginForm = new FormData();

        for (let i in values) {
            loginForm.append(i, values[i] ? values[i]: '');
        }

        for (let [i, val] of loginForm.entries()) {
            console.log('i ', i);
            console.log('val ', val);
        }

        axiosInstance.post(process.env.REACT_APP_BASE_URL + "login", loginForm)

        .then(response => {
            if (response.data.isSuccess) {
                console.info(response.data.data.details);
                Cookies.set('auth_user', JSON.stringify(response.data.data.details.user), {
                    expires: .5,
                    secure: true,
                    sameSite: 'strict',
                });

                response.data.data.details.display_photo && Cookies.set('auth_user_display_photo', JSON.stringify(response.data.data.details.display_photo), {
                    expires: .5,
                    secure: true,
                    sameSite: 'strict',
                });

                Cookies.set('auth_user_token', JSON.stringify(response.data.data.details.token), {
                    expires: .5,
                    secure: true,
                    sameSite: 'strict',
                });

                Cookies.set('auth_user_firebase_secret', JSON.stringify(response.data.data.details.firebase.secret), {
                    expires: .5,
                    secure: true,
                    sameSite: 'strict',
                });

                if (Cookies.get('auth_user') && Cookies.get('auth_user_token') && Cookies.get('auth_user_firebase_secret')) {
                    console.log('valid')

                    setStatus('success')
                    setHeader('Login successful');
                    setAlert('Redirecting...');

                    setTimeout(() => {
                        handleHideModal();
                        handleLogIn(true);
                        navigate('/home');
                        setTimeout(() => {
                            message.open({
                                content: <><Text type="span" size="medium" className="me-2">👋</Text><Text type="span">{'Hi, ' + response.data.data.details.user.first_name + '!'}</Text></>,
                                key,
                                duration: 2,
                                style: {
                                    marginTop: '25vh',
                                    zIndex: '99999999',
                                }
                            });
                        }, 2000);
                    }, 1000);
                } else {
                    handleLogIn(false);
                }
            } else {
                setStatus('error')
                setHeader('Login failed');
                setAlert(<Text type="span" color="red">{response.data.data.errorText}</Text>);
            }
        })

        .catch(err => {
            if (err.response && err.response.data.errors) {
                setStatus('error')
                setHeader('Login failed');
                setEmailHelp(<Text type="span" color="red">{err.response.data.errors.email[0]}</Text>);
                setPasswordHelp(<Text type="span" color="red">{err.response.data.errors.password[0]}</Text>);
            }
        });
    }

    return (
        <LoginWrapper>
        {
            alert && 
            <Alert
            status={status}
            icon
            header={header}
            className="mb-3">
                {alert}
            </Alert>
        }
            <Form
            name="login-form"
            {...formItemLayout}
            initialValues={{ remember: false, }}
            validateMessages={validateMessages}
            onFinish={onFinish}
            autoComplete="off">
                <Form.Item
                label="Email address"
                name="email"
                {...emailHelp && { help: emailHelp }}
                rules={[{ required: true, type: 'email', }]}>
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                {...passwordHelp && { help: passwordHelp }}
                rules={[{ required: true, type: 'string', }]}>
                    <Input.Password visibilityToggle allowClear />
                </Form.Item>

                {/* <Checkbox onChange={evt => onChange(evt)} className="mt-3">
                    <Text type="span">Remember me</Text>
                </Checkbox> */}

                <SubmitButtonWrapper className="d-grid gap-2 col-12 col-sm-2 mt-3 mx-auto">
                    <Button
                    type="submit"
                    className="mt-3"
                    text="Log In"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </LoginWrapper>
    )
}

export default Login;