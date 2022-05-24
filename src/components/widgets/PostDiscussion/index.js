import { useState, useEffect, } from 'react';
import { useOutletContext, useParams, } from 'react-router-dom';
import { 
    Form, 
    Input, 
    Select, 
    message,
} from 'antd';
import Cookies from 'js-cookie';
import { axiosInstance } from '../../../requests';
import { key, showAlert, } from '../../../util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleInfo, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Alert from '../../core/Alert';
import Text from '../../core/Text';
import Button from '../../core/Button';

const PostDiscussionWrapper = styled('div', {
    padding: '$space-3',
    background: '$blue',
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
    '.ant-form-item-control-input-content > div.ant-input-textarea > span.ant-input-affix-wrapper > textarea:focus, div.ant-form-item-control-input > div.ant-form-item-control-input-content > input:focus, div.ant-form-item-control-input-content > div.ant-select > div.ant-select-selector > span.ant-select-selector > span.ant-select-selection-search > input': {
        outline: 'unset',
        border: '1px solid $lightGray2 !important',
        boxShadow: 'unset !important',
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

const { Option } = Select;

export const PostDiscussion = ({ 
    isAuth, 
    handleForceRender,
    css,
}) => {
    const [form] = Form.useForm();
    const context = useOutletContext();
    const params = useParams();

    const [titleHelp, setTitleHelp] = useState('');
    const [bodyHelp, setBodyHelp] = useState('');
    const [categoryHelp, setCategoryHelp] = useState('');

    const handleTitleHelp = titleHelp => setTitleHelp(titleHelp);
    const handleBodyHelp = bodyHelp => setBodyHelp(bodyHelp);
    const handleCategoryHelp = categoryHelp => setCategoryHelp(categoryHelp);

    const categories = {
        hobbies: 'hobby',
        wellbeing: 'wellbeing',
        career: 'career',
        coaching: 'coaching',
        "science-and-tech": 'science-and-tech',
        "social-causes": 'social-cause',
    }

    const onFinish = values => {
        handleTitleHelp('');
        handleBodyHelp('');
        handleCategoryHelp('');

        if (isAuth) {
            const discussionForm = new FormData();

            for (let i in values) {
                values[i] && discussionForm.append(i, values[i]);
            }

            discussionForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            params.slug && discussionForm.append('category', categories[params.slug]);

            storeDiscussion(discussionForm).then(response => {
                if (response.data.isSuccess) {
                    form.resetFields();
                    context.handleIsPostVisible();
                    showAlert();
                    setTimeout(() => {
                        handleForceRender();
                        message.open({
                            content: <>
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="me-2"
                                    style={{ color: '#007B70', }} />
                                <Text type="span">Posted.</Text>
                            </>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
                } else {
                    showAlert();
                    setTimeout(() => {
                        handleForceRender();
                        message.open({
                            content: <>
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                    className="me-2"
                                    style={{ color: '#007B70', }} />
                                <Text type="span">{response.data.data.errorText}</Text>
                            </>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
                }
            })

            .catch (err => {
                if (err.response && err.response.data.errors) {
                handleTitleHelp(<Text type="span">{err.response.data.errors.title[0]}</Text>);
                handleBodyHelp(<Text type="span">{err.response.data.errors.body[0]}</Text>);
                handleCategoryHelp(<Text type="span">{err.response.data.errors.category[0]}</Text>);
                }
            });
        } else {
            console.error('on post discussion: no cookies');
        }
    };

    return (
        <PostDiscussionWrapper {...css && {css: {...css}}}>
            <Form
            name="discussion-form"
            {...formItemLayout}
            form={form}
            validateMessages={validateMessages}
            onFinish={onFinish}>
                <Form.Item
                label="Title"
                name="title"
                {...titleHelp && {help: titleHelp}}
                rules={[{ 
                    required: true,
                    min: 2,
                    max: 50,
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="How's it going?"
                    name="body"
                    {...bodyHelp && { help: bodyHelp }}
                    rules={[{
                        required: true,
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
                    required: true,
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
        </PostDiscussionWrapper>
    )
}

function storeDiscussion(discussionForm) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "discussion-posts/store", discussionForm, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default PostDiscussion;