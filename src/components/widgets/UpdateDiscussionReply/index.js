import { Form, Input, } from "antd";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const UpdateDiscussionReplyWrapper = styled('div', {
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea, .ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea:focus': {
        boxShadow: 'unset',
        borderRadius: '$small',
        padding: '$space-3',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea': {
        border: '1px solid $lightGray1 !important',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea:focus': {
        outline: 'unset',
        border: '1px solid $lightGray2 !important',
    },
});

const SubmitButtonWrapper = styled('div', {
    marginTop: '$space-5',
});

const validateMessages = {
    required: '${label} is required.',
    string: {
        range: "${label} must be at least ${min} and maximum of ${max} characters.",
    }
};

export const UpdateDiscussionReply = ({ 
    form, 
    values,
    onUpdateReply, 
    updateHelp,
    handleHideModal,
}) => {
    console.info(values);
    return (
        (values && values.body && values.slug) &&
        <UpdateDiscussionReplyWrapper>
            <Form
            name="update-discussion-reply-form"
            form={form}
            initialValues={{ body: values.body }}
            layout="vertical"
            validateMessages={validateMessages}
            onFinish={onUpdateReply}>
                <Form.Item
                label="Reply"
                name="body"
                {...updateHelp && { help: updateHelp }}
                rules={[{
                    required: true,
                    type: 'string',
                    min: 2,
                    max: 10000,
                }]}>
                    <Input.TextArea
                    allowClear
                    maxLength={10000}
                    rows={2}
                    showCount />
                </Form.Item>

                <SubmitButtonWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                    <Button
                    type="button"
                    text="Cancel"
                    className="flex-grow-1 flex-sm-grow-0"
                    onClick={() => handleHideModal()} />
                    <Button
                    type="submit"
                    text="Update"
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </UpdateDiscussionReplyWrapper>
    )
}

export default UpdateDiscussionReply;