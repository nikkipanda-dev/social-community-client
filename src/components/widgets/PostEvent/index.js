import { 
    Form, 
    Input, 
    Select,
    DatePicker,
    TimePicker,
} from "antd";
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import Button from "../../core/Button";

const PostEventWrapper = styled('div', {
    padding: '$space-3',
    'div.ant-row:nth-child(n+2)': {
        marginTop: '$space-3',
    },
    '.ant-col > label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '$space-1',
        fontSize: '$default',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper, .ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper:hover, .ant-form-item-control-input-content > span.ant-input-affix-wrapper:hover': {
        background: 'transparent',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea': {
        padding: '$space-3',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea, div.ant-form-item-control-input > div.ant-form-item-control-input-content > input, div.ant-form-item-control-input-content > div.ant-select, .ant-form-item-control-input-content > span.ant-input-affix-wrapper, .ant-form-item-control-input-content > span.ant-input-affix-wrapper:hover, .ant-picker': {
        boxShadow: 'unset !important',
        border: '1px solid $lightGray1 !important',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea:focus, .ant-form-item-control-input-content > span.ant-input-affix-wrapper:focus, .ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused.ant-input-affix-wrapper-status-error, .ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused.ant-input-affix-wrapper-status-success, .ant-picker-focused': {
        outline: 'unset',
        boxShadow: 'unset',
        border: '1px solid $lightGray2 !important',
    },
    'div.ant-form-item-control-input-content > div.ant-select > div.ant-select-selector': {
        border: 'unset !important',
        outline: 'unset',
        boxShadow: 'unset !important',
    },
});

const SubmitButtonWrapper = styled('div', {
    marginTop: '30px',
});

const formItemLayout = {
    labelCol: {
        span: 24,
        md: { span: 7, },
        lg: { span: 6, },
        xl: { span: 5, },
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

const { Option } = Select;

export const PostEvent = ({ 
    values,
    storeFn, 
    form,
    nameHelp,
    bodyHelp,
    startDateHelp,
    endDateHelp,
    categoryHelp,
    rsvpDateHelp,
    startDateTimeHelp,
    endDateTimeHelp,
}) => {
    return (
        <PostEventWrapper>
            <Form
            name="event-form"
            {...formItemLayout}
            form={form}
            {...values && { initialValues: { 
                name: values.name,
                body: values.details,
                category: (values.category.toLowerCase() === "science & tech") ? "science_and_tech" : 
                (values.category.toLowerCase() === "social cause") ? "social_cause" : values.category
            }}}
            validateMessages={validateMessages}
            onFinish={storeFn}>
                <Form.Item
                label="Name"
                name="name"
                {...nameHelp && { help: nameHelp }}
                rules={[{
                    required: (values && values.name) ? false : true,
                    min: 2,
                    max: 50,
                }]}>
                    <Input allowClear />
                </Form.Item>
                {
                    (values && values.start_datetime && values.end_datetime) && 
                    <>
                        <Text type="paragraph">Current start and end datetime:</Text>
                        <Text type="paragraph">
                            {
                                new Intl.DateTimeFormat('en-US', {
                                    timeZone: 'Asia/Manila',
                                    hourCycle: 'h24',
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }).format(new Date(values.start_datetime))
                            }
                            &#xa0;until&#xa0;
                            {
                                new Intl.DateTimeFormat('en-US', {
                                    timeZone: 'Asia/Manila',
                                    hourCycle: 'h24',
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }).format(new Date(values.end_datetime))
                            }
                        </Text>
                    </>
                }
                <Form.Item
                label={((values && values.start_datetime) ? "New s" : "S") + "tart date"}
                name="start_date"
                {...startDateHelp && { help: startDateHelp }}
                rules={[{
                    required: (values && values.start_datetime) ? false : true,
                    type: 'date',
                }]}>
                    <DatePicker allowClear format="YYYY/MM/DD" />
                </Form.Item>
                <Form.Item
                label="Start time"
                name="start_date_time"
                {...startDateTimeHelp && { help: startDateTimeHelp }}
                rules={[{
                    required: (values && values.start_datetime) ? false : true,
                }]}>
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                label="End date"
                name="end_date"
                {...endDateHelp && { help: endDateHelp }}
                rules={[{
                    required: (values && values.end_datetime) ? false : true,
                    type: 'date',
                }]}>
                    <DatePicker allowClear format="YYYY/MM/DD" />
                </Form.Item>
                <Form.Item
                label="End time"
                name="end_date_time"
                {...endDateTimeHelp && { help: endDateTimeHelp }}
                rules={[{
                    required: (values && values.end_datetime) ? false : true,
                }]}>
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    label="RSVP on or before"
                    name="rsvp_date"
                    {...rsvpDateHelp && { help: rsvpDateHelp }}
                    rules={[{
                        required: (values && values.rsvp_date) ? false : true,
                        type: 'date',
                    }]}>
                    <DatePicker allowClear format="YYYY/MM/DD" />
                </Form.Item>
                <Form.Item
                label="How's it going?"
                name="body"
                {...bodyHelp && { help: bodyHelp }}
                rules={[{
                    required: (values && values.details) ? false : true,
                    type: 'string',
                    message: 'Body is required.',
                    min: 2,
                    max: 300,
                }]}>
                    <Input.TextArea
                    allowClear
                    maxLength={300}
                    rows={2}
                    showCount />
                </Form.Item>
                <Form.Item
                label="Category"
                name="category"
                {...categoryHelp && { help: categoryHelp }}
                rules={[{
                    required: (values && values.category) ? false : true,
                    type: 'string',
                    min: 2,
                    max: 300,
                }]}>
                    <Select style={{ width: 120, width: '100%' }}>
                        <Option value="hobby">Hobby</Option>
                        <Option value="wellbeing">Wellbeing</Option>
                        <Option value="career">Career</Option>
                        <Option value="coaching">Coaching</Option>
                        <Option value="science_and_tech">Science and Tech</Option>
                        <Option value="social_cause">Social Cause</Option>
                    </Select>
                </Form.Item>
                <SubmitButtonWrapper className="d-flex justify-content-sm-end align-items-sm-center">
                    <Button
                    type="submit"
                    text="Submit"
                    className="flex-grow-1 flex-sm-grow-0"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </PostEventWrapper>
    )
}

export default PostEvent;