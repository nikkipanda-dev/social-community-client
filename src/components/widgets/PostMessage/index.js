import { forwardRef, useRef, } from "react";
import { Form, Input, } from "antd";
import Picker from 'emoji-picker-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, } from "@fortawesome/free-solid-svg-icons";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";
import Text from "../../core/Text";
import Image from "../../core/Image";

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

const MessagesEmojiWrapper = styled('div', {
    maxWidth: '100%',
    position: 'absolute',
    zIndex: '999999',
    bottom: '23vh',
    left: 'auto',
    '@media screen and (max-width: 575px)': {
        position: 'relative',
        margin: 'auto auto -300px',
        bottom: '0px',
        padding: '$space-3 $space-3 $space-3 0px',
    },
});

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
            <MessagesEmojiWrapper ref={ref}>
                <Picker onEmojiClick={onEmojiClick} />
            </MessagesEmojiWrapper>
        }
            <Form
            name="message-form"
            form={form}
            validateMessages={validateMessages}
            onFinish={storeFn}
            className="d-flex flex-column flex-sm-row"
            {...formItemLayout}>
                <Form.Item
                name="message"
                className="flex-grow-1">
                    <Input.TextArea
                    allowClear
                    maxLength={10000}
                    rows={2}
                    showCount 
                    onKeyDown={evt => handleOnKeyDown(evt)}/>
                </Form.Item>

                <Form.Item className="d-flex ms-sm-3">
                    <Button
                    type="submit"
                    text="Send"
                    ref={submitBtnRef}
                    color="brown"
                    css={{ width: '100%', }} />
                </Form.Item>
            </Form>
        </PostMessageWrapper>
    )
});

export default PostMessage;