import { useState, useEffect, } from "react";
import { axiosInstance } from "../../../requests";
import { Form, Input, } from "antd";
import Cookies from 'js-cookie';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, } from "../../../util/Firebase";
import { useNavigate, useParams, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const RegisterWrapper = styled('div', {});

const SubmitButtonWrapper = styled('div', {});

const validateMessages = {
    required: '${label} is required.',
    types: {
        email: '${label} is not a valid email.',
    },
    string: {
        range: "${label} must be at least ${min} and maximum of ${max} characters.",
    }
};

const formItemLayout = {
    labelCol: {
        sm: { span: 4 },
    },
    wrapperCol: {
        sm: { span: 24, offset: 1, },
    },
}

export const Register = ({ 
    isAuth, 
    authUser,
    handleLogIn,
}) => {
    const [form] = Form.useForm();
    const params = useParams();
    const navigate = useNavigate();

    const [details, setDetails] = useState('');
    
    const handleDetails = details => setDetails(details);

    const onFinish = values => {
        const registerForm = new FormData();

        for (let i in values) {
            registerForm.append(i, values[i]);
        }

        for (let [i, val] of registerForm.entries()) {
            console.log('i ', i);
            console.log('val ', val);
        }

        axiosInstance.post(process.env.REACT_APP_BASE_URL + "register/" + params.token, registerForm)

        .then(response => {
            console.log('res ', response.data);
            if (response.data.isSuccess) {
                Cookies.set('auth_user', JSON.stringify(response.data.data.details.user), {
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
                    const firebaseCred = response.data.data.details.firebase;

                    if (Object.keys(firebaseCred).length > 0) {
                        handleDetails({
                            user: response.data.data.details,
                            secret: firebaseCred.secret,
                        });
                    }
                } else {
                    console.log('invalid');
                    handleLogIn(false);
                }
            } else {
                console.log('err res ', response.data.data.errorText);
            }
        })

        .catch(err => {
            if (err.response && err.response.data.errors) {
                console.log('err ', err.response.data.errors);
            }
        });
    }

    useEffect(() => {
        let loading = true;

        if (loading && (Object.keys(details).length > 0)) {
            createUserWithEmailAndPassword(
                auth,
                details.user.user.email,
                details.secret,
            )

            .then(response => {
                console.info('res ', response);
                setDoc(doc(db, "users", response.user.uid), {
                    uid: response.user.uid,
                    first_name: details.user.user.first_name,
                    last_name: details.user.user.last_name,
                    email: details.user.user.email,
                    username: details.user.user.username,
                    isOnline: true,
                    created_at: details.user.user.created_at,
                });


                setTimeout(() => {
                    handleLogIn(true);
                    navigate('/home');
                }, 1000);
            })

            .catch(error => {
                console.error('err catch ', error);
            });
        }

        return () => {
            loading = false;
        }
    }, [details]);

    useEffect(() => {
        let loading = true;

        if (loading && isAuth) {
            setDoc(db, "notifications", authUser.username, {
                friend_requests: '',
                new: {
                    microblog_posts: {},
                    discussion_posts: {},
                    event_posts: {},
                    blog_posts: {},
                },
                history: {
                    microblog_posts: {},
                    discussion_posts: {},
                    event_posts: {},
                    blog_posts: {},
                }
            });
        }

        return () => {
            loading = false;
        }
    }, [isAuth]);

    return (
        <RegisterWrapper>
            <Form
            name="register-form"
            {...formItemLayout}
            initialValues={{ remember: true }}
            validateMessages={validateMessages}
            onFinish={onFinish}
            form={form}
            autoComplete="off">
                <Form.Item
                label="First name"
                name="first_name"
                rules={[{ required: true, type: 'string', min: 2, max: 100 }]}>
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                label="Last name"
                name="last_name"
                rules={[{ required: true, type: 'string', min: 2, max: 100 }]}>
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, type: 'string', min: 2, max: 100 }]}>
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                label="Email address"
                name="email"
                rules={[{ required: true, type: 'email', }]}>
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, type: 'string', min: 8, max: 20 }]}>
                    <Input.Password visibilityToggle allowClear />
                </Form.Item>

                <Form.Item
                label="Repeat password"
                name="password_confirmation"
                rules={[
                    { required: true, },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),]}>
                    <Input.Password visibilityToggle allowClear />
                </Form.Item>

                <SubmitButtonWrapper className="d-grid gap-2 col-12 col-sm-2 mx-auto">
                    <Button
                    type="submit"
                    className="mt-3"
                    text="Register"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </RegisterWrapper>
    )
}

export default Register;