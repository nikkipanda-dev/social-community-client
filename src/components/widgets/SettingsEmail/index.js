import { Form, Input, } from "antd";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const SettingsEmailWrapper = styled('div', {});

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
        md: { span: 6, },
        lg: { span: 5, },
        xl: { span: 4, },
    },
    wrapperCol: {
        sm: { span: 24, offset: 1, },
    },
}

export const SettingsEmail = ({ 
    emailHelp,
    form,
    updateFn,
    className,
    css,
}) => {
    return (
        <SettingsEmailWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <Form
            name="email-form"
            {...formItemLayout}
            form={form}
            validateMessages={validateMessages}
            onFinish={updateFn}
            autoComplete="off">
                <Form.Item
                label="Email address"
                name="email"
                {...emailHelp && { help: emailHelp }}
                rules={[{ required: true, type: 'email', }]}>
                    <Input allowClear />
                </Form.Item>

                <SubmitButtonWrapper className="d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between align-items-sm-center">
                    <Button
                    type="submit"
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mx-sm-auto"
                    text="Save"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </SettingsEmailWrapper>
    )
}

export default SettingsEmail;