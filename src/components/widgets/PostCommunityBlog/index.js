import { 
    useState, 
    useEffect,
    useRef,
} from "react";
import TipTapEditor from "../TipTapEditor";
import { richTextStyle, } from "../../../stitches.config";
import { 
    Form, 
    Input, 
    message,
} from "antd";
import { key, showAlert, } from "../../../util";
import Cookies from 'js-cookie';
import { useOutletContext, useNavigate, } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCaretLeft,
    faCircleInfo,
    faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";
import Text from "../../core/Text";
import Heading from "../../core/Heading";
import Image from "../../core/Image";

const PostCommunityBlogWrapper = styled('div', {
    '.ant-col > label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '$space-2',
        fontSize: '$default',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper > input, div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper, div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused': {
        outline: 'unset',
        boxShadow: 'unset !important',
        border: 'unset',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper': {
        border: '1px solid $lightGray1 !important',
        padding: '$space-2',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused': {
        border: '1px solid $lightGray2 !important',
    },
});

const PreviewWrapper = styled('div', richTextStyle);

const ImageWrapper = styled('div', {});

const ActionWrapper = styled('div', {
    marginTop: '$space-3',
});

const validateMessages = {
    required: '${label} is required.',
    string: {
        range: "${label} must be at least ${min} and maximum of ${max} characters.",
    }
};

const formItemLayout = {
    labelCol: {
        span: 24,
        md: { span: 4, },
        lg: { span: 3, },
    },
    wrapperCol: {
        span: 24,
        md: { span: 24, },
    },
}

export const PostCommunityBlog = ({ storeFn, }) => {
    const [form] = Form.useForm();
    const ref = useRef('');
    const context = useOutletContext();
    const navigate = useNavigate();

    const [forceRender, setForceRender] = useState(false);
    const [output, setOutput] = useState('');
    const [files, setFiles] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [title, setTitle] = useState('');
    const [titleHelp, setTitleHelp] = useState('');
    const [bodyHelp, setBodyHelp] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const handleForceRender =() => setForceRender(!(forceRender));
    const handleOutput = output => setOutput(output);
    const handleImageUrls = imageUrls => setImageUrls(imageUrls);
    const handleFiles = files => setFiles(files);
    const handleTitleHelp = titleHelp => setTitleHelp(titleHelp);
    const handleBodyHelp = bodyHelp => setBodyHelp(bodyHelp);
    const handleTitleChange = title => setTitle(title);

    const limit = 10000;

    const handleTogglePreview = () => {
        setShowPreview(!showPreview);
    }

    const handleRemoveImage = name => {
        handleFiles(Object.values(files).filter(file => file.name !== name));
        handleImageUrls(Object.values(imageUrls).filter(imageUrl => imageUrl.name !== name));
    }

    const handleImageChange = () => {   
        if (ref.current.files.length > 0) {
            for (let i of ref.current.files) {
                if (i.size > (2 * 1024 * 1024)) {
                    console.log("too large ");
                    return;
                }
            }

            handleFiles(ref.current.files);
            handleForceRender();
        }
    }

    const onValuesChange = (changedVal, _) => {
        handleTitleChange(changedVal.title);
    }
    
    const handleBodyChange = () => {
        handleBodyHelp('');
        if (!(output) && (Object.keys(output).length === 0)) {
            handleBodyHelp(<Text type="span" color="red">Body cannot be empty.</Text>);
        }
    }

    const onFinishFailed = ({ values, errorFields, outOfDate }) => {
        handleBodyChange();
    }

    const onFinish = values => {
        handleTitleHelp('');
        handleBodyChange();

        if (!(context.isAuth)) {
            console.error("on store community blog: no cookies");
            return;
        }

        const storeForm = new FormData();

        for (let i in values) {
            values[i] && storeForm.append(i, values[i]);
        }

        if (files && (Object.keys(files).length > 0)) {
            let images = [];
            let ctr = 0;

            for (let i of files) {
                ++ctr;
                
                storeForm.append(`images[${ctr}]`, i);
            }
        }

        storeForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
        storeForm.append('body', JSON.stringify(output));

        storeFn(storeForm).then(response => {
            showAlert();

            console.info('res ', response.data);
            if (!(response.data.isSuccess)) {
                setTimeout(() => {
                    message.open({
                        content: <><FontAwesomeIcon icon={faCircleInfo} className="fa-fw me-2" /><Text type="span" className="fa-xl">{response.data.data.errorText}</Text></>,
                        key,
                        style: {
                            marginTop: '25vh',
                            zIndex: '99999999',
                        },
                    });
                }, 500);

                return;
            }

            setTimeout(() => {
                message.open({
                    content: <><FontAwesomeIcon icon={faCheckCircle} className="fa-fw me-2" style={{ color: '#007B70', }} /><Text type="span" className="fa-xl">Posted.</Text></>,
                    key,
                    style: {
                        marginTop: '25vh',
                        zIndex: '99999999',
                    },
                });

                navigate("/community-blog/post/" + response.data.data.details);
            }, 500);
        })

        .catch(err => {
            console.error('err ', err.response && err.response.data.errors);
        })
    }

    useEffect(() => {        
        let loading = true;
        let array = [];

        if (loading && (Object.keys(files).length > 0)) {
            for (let i of files) {
                console.log(i);
                array.push({src: URL.createObjectURL(i), name: i.name});
            }

            console.log('arra ', array);
            handleImageUrls(array);
        }

        return () => {
            if (array.length > 0) {
                for (let i of array) {
                    URL.revokeObjectURL(i);
                }
            }

            loading = false;
        }
    }, [forceRender]);

    return (
        <PostCommunityBlogWrapper>
        {
            showPreview && 
            <ActionWrapper className="d-flex" css={{ marginTop: '0px', marginBottom: '$space-3', }}>
                <Button
                type="button"
                className="flex-grow-1 flex-sm-grow-0"
                text={<Text type="span"><FontAwesomeIcon icon={faCaretLeft} className="fa-fw" />Go back</Text>}
                onClick={() => handleTogglePreview()} />
            </ActionWrapper>
        }
            <Form
            name="community-blog-form"
            form={form}
            validateMessages={validateMessages}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={onValuesChange}
            {...formItemLayout}
            autoComplete="off">
            {
                !(showPreview) &&
                <>
                    <Form.Item
                    label="Title"
                    name="title"
                    {...titleHelp && { help: titleHelp }}
                    rules={[{
                        required: true,
                        type: 'string',
                        min: 2,
                        max: 50,
                    }]}>
                        <Input allowClear />
                    </Form.Item>
                    <input 
                    name="images[]" 
                    type="file"
                    accept="image/*" 
                    ref={ref}
                    multiple
                    onChange={() => handleImageChange()} />
                {
                    (imageUrls && (Object.keys(imageUrls).length > 0)) && 
                    Object.keys(imageUrls).map((i, val) => {
                        return (
                            <ImageWrapper key={i}>
                                <Image src={Object.values(imageUrls)[val].src} css={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                }} />
                                <Button 
                                type="button" 
                                text="Remove" 
                                onClick={() => handleRemoveImage(Object.values(imageUrls)[val].name)} />
                            </ImageWrapper>
                        )
                    })
                }
                    <PreviewWrapper>
                        <TipTapEditor
                        content={output}
                        limit={limit}
                        isEditable
                        handleOutput={handleOutput} />
                        {bodyHelp}
                    </PreviewWrapper>
                </>
            }
            {
                showPreview &&
                <PreviewWrapper>
                    <Heading type={6} text={(title && (title.length > 0)) ? title : "Your Title Here"} />
                    <TipTapEditor
                    limit={limit}
                    content={output}
                    handleOutput={handleOutput} />
                </PreviewWrapper>
            }
            {
                !(showPreview) &&
                <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                    <Button
                    type="button"
                    className="flex-grow-1 flex-sm-grow-0"
                    text="Preview"
                    onClick={() => handleTogglePreview()} />
                    <Button
                    type="submit"
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                    text="Submit"
                    color="brown" />
                </ActionWrapper>
            }
            </Form>
        </PostCommunityBlogWrapper>
    )
}

export default PostCommunityBlog;