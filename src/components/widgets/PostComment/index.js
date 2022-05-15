import { useState, useEffect, } from "react";
import { Form, Input, message, } from "antd";
import { isAuth, key, showAlert, } from "../../../util";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import Button from "../../core/Button";
import Image from '../../core/Image';

const PostCommentWrapper = styled('div', {
    'label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '35px',
        fontWeight: 'bold',
        fontSize: '$default',
    },
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea': {
        borderRadius: '$small',
        padding: '$space-3',
        border: 'unset',
    },
    '.ant-form-item-control-input-content > input, .ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper, .ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused': {
        border: '5px solid $black !important',
        borderRadius: '$default',
        boxShadow: 'unset !important',
        padding: '$space-3',
    },
});

const SubmitButtonWrapper = styled('div', {
    marginTop: '30px',
});

export const PostComment = ({ storeComment, }) => {
    const [form] = Form.useForm();
    const [help, setHelp] = useState('');

    return (
        <PostCommentWrapper className="p-2 d-flex">
            <Image src="/avatar_medium.png" css={{ width: '60px', height: '60px', objectFit: 'cover', }}/>
            <Form
            name="microblog-form"
            className="flex-grow-1 ms-3"
            layout="vertical"
            onFinish={storeComment}
            autoComplete="off">
                <Form.Item
                name="body"
                {...help && { help: help }}
                rules={[{
                    required: true,
                    type: 'string',
                    min: 2,
                    max: 300,
                    message: 'Comment is required.'
                }]}>
                    <Input.TextArea
                    allowClear
                    maxLength={300}
                    rows={2}
                    showCount />
                </Form.Item>

                <SubmitButtonWrapper className="d-flex justify-content-md-end align-items-center">
                    <Button
                    type="submit"
                    text="Post"
                    className="flex-grow-1 flex-md-grow-0"
                    color="brown" />
                </SubmitButtonWrapper>
            </Form>
        </PostCommentWrapper>
    )
}

export default PostComment;