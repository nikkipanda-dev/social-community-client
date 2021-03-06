import { useState, } from "react";
import { Form, Input, } from "antd";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";
import Image from '../../core/Image';

const PostCommentWrapper = styled('div', {
    'label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '35px',
        fontWeight: 'bold',
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

export const PostComment = ({ storeFn, form, }) => {
    const [help, setHelp] = useState('');

    return (
        <PostCommentWrapper className="d-flex">
            <Image src="/avatar_medium.png" css={{ 
                width: '60px', 
                height: '60px', 
                objectFit: 'cover',
            }}/>
            <Form
            name="microblog-form"
            className="flex-grow-1 ms-3"
            layout="vertical"
            form={form}
            onFinish={storeFn}
            autoComplete="off">
                <Form.Item
                name="body"
                {...help && { help: help }}
                rules={[{
                    required: true,
                    type: 'string',
                    min: 2,
                    max: 10000,
                    message: 'Comment is required.'
                }]}>
                    <Input.TextArea
                    allowClear
                    maxLength={10000}
                    rows={2}
                    showCount />
                </Form.Item>

                <SubmitButtonWrapper className="d-flex justify-content-sm-end align-items-sm-center">
                    <Button
                    type="submit"
                    text="Post"
                    className="flex-grow-1 flex-sm-grow-0"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </PostCommentWrapper>
    )
}

export default PostComment;