import { Form, Input, } from "antd";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const SettingsPasswordWrapper = styled('div', {});

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
        sm: { span: 8, },
        md: { span: 7, },
        lg: { span: 6, },
        xl: { span: 4, },
    },
    wrapperCol: {
        sm: { span: 24, offset: 2, },
        md: { span: 24, offset: 1, },
    },
}


export const SettingsPassword = ({
    form,
    passwordHelp,
    updateFn,
    className,
    css,
}) => {
    return (
        <SettingsPasswordWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <Form
            name="password-form"
            {...formItemLayout}
            form={form}
            validateMessages={validateMessages}
            onFinish={updateFn}
            autoComplete="off">
                <Form.Item
                label="Password"
                name="password"
                {...passwordHelp && {help: passwordHelp}}
                rules={[{ 
                    required: true, 
                    type: 'string', 
                    min: 8, 
                    max: 20,
                }]}>
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
                            return Promise.reject(new Error('The two passwords that you entered do not match.'));
                        },
                    }),]}>
                    <Input.Password visibilityToggle allowClear />
                </Form.Item>

                <SubmitButtonWrapper className="d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between align-items-sm-center">
                    <Button
                    type="submit"
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mx-sm-auto"
                    text="Save"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </SettingsPasswordWrapper>
    )
}

export default SettingsPassword;