import { forwardRef, useRef, } from "react";
import { Form, Input, } from "antd";
import Picker from 'emoji-picker-react';
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const PostMessageWrapper = styled('div', {
    height: '15vh',
    'textarea': {
        resize: 'none',
        height: '100% !important',
    },
    'label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '35px',
        fontSize: '$default',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper': {
        background: 'transparent',
    },
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

const MessagesEmojiWrapper = styled('div', {});

const pickerStyle = {
    width: '20%',
    position: 'absolute',
    zIndex: '999999',
    bottom: '23vh',
    left: 'auto'
}

export const PostMessage = forwardRef(({ 
    storeFn, 
    form, 
    className, 
    css,
    isEmojiShown,
    onEmojiClick,
}, ref) => {
    const submitBtnRef = useRef('');

    const handleOnKeyDown = evt => {
        (evt.keyCode === 13) && submitBtnRef.current.click();
    }

    return (
        <PostMessageWrapper 
        className={' ' + (className ? (' ' + className) : '')} 
        {...css && {css: {...css}}} 
        ref={ref}>
        {
            isEmojiShown &&
            <MessagesEmojiWrapper ref={ref} >
                <Picker onEmojiClick={onEmojiClick} pickerStyle={{ ...pickerStyle }} />
            </MessagesEmojiWrapper>
        }
            <Form
            name="message-form"
            form={form}
            validateMessages={validateMessages}
            onFinish={storeFn}
            {...formItemLayout}>
                <Form.Item
                name="message"
                // {...help && { help: help }}
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
                    showCount 
                    onKeyDown={evt => handleOnKeyDown(evt)}/>
                </Form.Item>

                <SubmitButtonWrapper className="d-flex justify-content-md-end align-items-center">
                    <Button
                    type="submit"
                    text="Send"
                    ref={submitBtnRef}
                    className="flex-grow-1 flex-md-grow-0"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </PostMessageWrapper>
    )
});

export default PostMessage;