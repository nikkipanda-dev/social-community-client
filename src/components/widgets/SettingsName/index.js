import { Form, Input, } from "antd";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const SettingsNameWrapper = styled('div', {});

const SubmitButtonWrapper = styled('div', {});

const validateMessages = {
    required: '${label} is required.',
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

export const SettingsName = ({
    form,
    updateFn,
    firstNameHelp,
    lastNameHelp,
    className,
    css,
}) => {
    return (
        <SettingsNameWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <Form
            name="name-form"
            {...formItemLayout}
            form={form}
            validateMessages={validateMessages}
            onFinish={updateFn}
            autoComplete="off">
                <Form.Item
                label="First name"
                name="first_name"
                {...firstNameHelp && { help: firstNameHelp }}
                rules={[{ 
                    required: true, 
                    type: 'string',
                    min: 2,
                    max: 100,
                }]}>
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                label="Last name"
                name="last_name"
                {...lastNameHelp && { help: lastNameHelp }}
                rules={[{
                    required: true,
                    type: 'string',
                    min: 2,
                    max: 100,
                }]}>
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
        </SettingsNameWrapper>
    )
}

export default SettingsName;