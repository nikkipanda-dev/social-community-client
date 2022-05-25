import { 
    Form, 
    Input, 
    Select,
} from "antd";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const { Option } = Select;

const UpdateDiscussionPostWrapper = styled('div', {
    'div.ant-row:nth-child(n+2)': {
        marginTop: '$space-3',
    },
    '.ant-col > label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '$space-1',
        fontSize: '$default',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper, .ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper:hover': {
        background: 'transparent',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea, .ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea:focus': {
        boxShadow: 'unset',
        padding: '$space-3',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea, div.ant-form-item-control-input > div.ant-form-item-control-input-content > input, div.ant-form-item-control-input-content > div.ant-select': {
        border: '1px solid $lightGray1 !important',
    },
    'div.ant-form-item-control-input-content > div.ant-select > div.ant-select-selector, div.ant-form-item-control-input-content > div.ant-select > div.ant-select-selector > span.ant-select-selector > span.ant-select-selection-search > input, .ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea:focus, div.ant-form-item-control-input > div.ant-form-item-control-input-content > input:focus': {
        boxShadow: 'unset !important',
        outline: 'unset',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea:focus, div.ant-form-item-control-input > div.ant-form-item-control-input-content > input:focus, div.ant-form-item-control-input-content > div.ant-select > div.ant-select-selector > span.ant-select-selector > span.ant-select-selection-search > input': {
        border: '1px solid $lightGray2 !important',
    },
    'div.ant-form-item-control-input-content > div.ant-select > div.ant-select-selector': {
        border: 'unset !important',
    },
});

const SubmitButtonWrapper = styled('div', {
    marginTop: '$space-5',
});

const formItemLayout = {
    labelCol: {
        span: 24,
        md: { span: 6, },
        lg: { span: 5, },
        xl: { span: 4, },
    },
    wrapperCol: {
        span: 24,
        md: { span: 24, },
    },
}

const validateMessages = {
    required: '${label} is required.',
    string: {
        range: "${label} must be at least ${min} and maximum of ${max} characters.",
    }
};

export const UpdateDiscussionPost = ({
    form,
    onUpdatePost,
    id,
    values,
    bodyHelp,
    categoryHelp,
    titleHelp,
    handleHideModal,
}) => {
    return (
        <UpdateDiscussionPostWrapper id={id}>
            <Form
            name="update-discussion-form"
            form={form}
            initialValues={{ 
                title: values.title, 
                body: values.body,
                category: values.category.toLowerCase(),
            }}
            layout="vertical"
            validateMessages={validateMessages}
            {...formItemLayout}
            onFinish={onUpdatePost}>
                <Form.Item
                label="Title"
                name="title"
                {...titleHelp && { help: titleHelp }}
                rules={[{
                    required: true,
                    min: 2,
                    max: 50,
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                label="Body"
                name="body"
                {...bodyHelp && { help: bodyHelp }}
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
                <Form.Item
                label="Category"
                name="category"
                {...categoryHelp && { help: categoryHelp }}
                rules={[{
                    required: true,
                    type: 'string',
                    min: 2,
                    max: 300,
                }]}>
                    <Select style={{ width: 120, width: '100%' }} getPopupContainer={() => document.getElementById('update-discussion')}>
                        <Option value="hobby">Hobby</Option>
                        <Option value="wellbeing">Wellbeing</Option>
                        <Option value="career">Career</Option>
                        <Option value="coaching">Coaching</Option>
                        <Option value="science_and_tech">Science and Tech</Option>
                        <Option value="social_cause">Social Cause</Option>
                    </Select>
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
        </UpdateDiscussionPostWrapper>
    )
}

export default UpdateDiscussionPost;