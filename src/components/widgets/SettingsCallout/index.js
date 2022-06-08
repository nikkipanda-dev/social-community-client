import { Form, Input, } from "antd";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const SettingsCalloutWrapper = styled('div', {});

const SubmitButtonWrapper = styled('div', {});

const validateMessages = {
    required: '${label} is required.',
    string: {
        range: "${label} must be at least ${min} and maximum of ${max} characters.",
    }
};

const formItemLayout = {
    labelCol: {
        sm: { span: 6, },
        md: { span: 5, },
        lg: { span: 4, },
        xl: { span: 3, },
    },
    wrapperCol: {
        sm: { span: 24, offset: 1, },
    },
}

export const SettingsCallout = ({
    calloutHelp,
    form,
    updateFn,
    className,
    css,
}) => {
    return (
        <SettingsCalloutWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <Form
            name="callout-form"
            {...formItemLayout}
            form={form}
            validateMessages={validateMessages}
            onFinish={updateFn}>
                <Form.Item
                label="Callout"
                name="callout"
                {...calloutHelp && { help: calloutHelp }}
                rules={[{
                    required: true,
                    type: 'string',
                    min: 2,
                    max: 200,
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
        </SettingsCalloutWrapper>
    )
}

export default SettingsCallout;