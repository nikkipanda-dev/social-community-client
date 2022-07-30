import { useState, useEffect, } from "react";
import { 
    useParams, 
    useOutletContext, 
    useNavigate,
    Link,
} from "react-router-dom";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { Form, } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCaretLeft, 
    faFlag,
    faTrash,
    faPen,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Heading from "../../core/Heading";
import Text from "../../core/Text";
import Button from "../../core/Button";
import DiscussionPostReplies from "../DiscussionPostReplies";
import DiscussionPostSupporters from "../DiscussionPostSupporters";
import Alert from "../../core/Alert";
import Modal from "../Modal";
import UpdateDiscussionPost from "../UpdateDiscussionPost";

const DiscussionPostWrapper = styled('div', {
    width: '100%',
    padding: '0px $space-3',
    'a': {
        textDecoration: 'unset',
        color: '$pineGreen',
    },
    'a:hover': {
        color: '$darkGray',
    },
});

const DiscussionPostHeaderWrapper = styled('div', {
    marginTop: '$space-3',
});

const DiscussionPostTitleWrapper = styled('div', {});

const DiscussionPostMiscWrapper = styled('div', {
    marginTop: '$space-5',
});

const DiscussionPostContentWrapper = styled('div', {
    marginTop: '$space-5',
});

const MiscWrapper = styled('div', {
    padding: '$space-3',
});

const ActionWrapper = styled('div', {
    '> button:nth-child(n+2)': {
        marginLeft: '$space-2',
    },
});

export const DiscussionPost = () => {
    const params = useParams();
    const navigate = useNavigate();
    const context = useOutletContext();
    const [form] = Form.useForm();

    const [values, setValues] = useState('');
    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');
    const [action, setAction] = useState('');
    const [help, setHelp] = useState('');
    const [titleHelp, setTitleHelp] = useState('');
    const [bodyHelp, setBodyHelp] = useState('');
    const [categoryHelp, setCategoryHelp] = useState('');
    const [isVisible, setIsVisible] = useState('');

    const handleValues = values => setValues(values);
    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleHelp = help => setHelp(help);
    const handleTitleHelp = titleHelp => setTitleHelp(titleHelp);
    const handleBodyHelp = bodyHelp => setBodyHelp(bodyHelp);
    const handleCategoryHelp = categoryHelp => setCategoryHelp(categoryHelp); 
    const handleShowModal = () => setIsVisible(true);
    const handleHideModal = () => {
        setIsVisible(false);
        handleHelp('');
        form.resetFields();
    };

    const handleAction = action => {
        if (action === "delete") {
            handleStatus("warning");
            handleHeader("Confirmation")
            handleHelp(<Text type="span">You are about to delete this post. Continue?</Text>);
        }

        setAction(action);
        handleShowModal();
    };

    const handleNavigator = () => {
        navigate('../');
    }

    const onUpdatePost = values => {
        if (!(context.isAuth && params.slug)) {
            console.error('err update: no cookies ');
            return;
        }

        const updateForm = new FormData();

        for (let i in values) {
            values[i] && updateForm.append(i, values[i]);
        }

        updateForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
        updateForm.append('slug', params.slug);

        updateDiscussion(updateForm).then(response => {
            if (!(response.data.isSuccess)) {
                handleStatus('info');
                handleHeader("Alert");
                handleHelp(<Text type="span">{response.data.data.errorText}</Text>)
                return;
            }

            if (response.data.isSuccess) {
                handleValues(response.data.data.details);
                handleStatus('success');
                handleHeader("Update successful");
                handleHelp(<Text type="span">Going back...</Text>)
            }

            setTimeout(() => {
                handleHideModal();
            }, 1500);
        })

        .catch(err => {
            if (err.response && err.response.data.errors) {
                handleTitleHelp(err.response.data.errors.title[0]);
                handleBodyHelp(err.response.data.errors.body[0]);
                handleCategoryHelp(err.response.data.errors.category[0]);
            }
        });
    }

    const onRemovePost = () => {
        if (!(context.isAuth && params.slug)) {
            console.error('err delete: no cookies ');
            return;
        }

        const deleteForm = new FormData();

        deleteForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
        deleteForm.append('slug', params.slug);

        removeDiscussion(deleteForm).then(response => {
            if (!(response.data.isSuccess)) {
                handleStatus('info');
                handleHeader("Alert");
                handleHelp(<Text type="span">{response.data.data.errorText}</Text>)
                return;
            }

            if (response.data.isSuccess) {
                handleStatus('success');
                handleHeader("Post deleted");
                handleHelp(<Text type="span">Going back...</Text>)
            }

            setTimeout(() => {
                navigate("../");
                handleHideModal();
            }, 1500);
        })

        .catch(err => {
            if (err.response && err.response.data.errors) {
                console.error('err delete disc post ', err.response.data.errors);
            }
        });
    }

    useEffect(() => {
        let loading = true;

        if (loading & context.isAuth && params.slug) {
            getDiscussionPost(params.slug).then (response => {
                if (response.data.isSuccess) {
                    handleValues(response.data.data.details);
                } else {
                    console.error('err get ', response.data.data.errorText);   
                }
            })

            .catch (err => {
                console.error('err get ', err.response.data.errors);
            });
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        (context.isAuth && (values && Object.keys(values).length > 0)) && 
        <DiscussionPostWrapper>
            <MiscWrapper className="d-flex flex-column flex-sm-row justify-content-md-between align-items-md-center" css={{ padding: '0px', }}>
                <Button 
                type="button" 
                text={<Text type="span"><FontAwesomeIcon icon={faCaretLeft} className="fa-fw me-2" />Back</Text>} 
                onClick={() => handleNavigator()} />
                <ActionWrapper>
                    <Button
                    type="button"
                    color="orange"
                    text={<Text type="span"><FontAwesomeIcon icon={faPen} className="fa-fw me-2" />Update</Text>}
                    onClick={() => handleAction("update")} />
                    <Button
                    type="button"
                    color="red"
                    text={<Text type="span"><FontAwesomeIcon icon={faTrash} className="fa-fw me-2" />Delete</Text>}
                    onClick={() => handleAction("delete")} />
                    <Button
                    type="button"
                    color="transparent"
                    className="button-plain-red"
                    text={<Text type="span"><FontAwesomeIcon icon={faFlag} className="fa-fw" /></Text>} />
                </ActionWrapper>
            </MiscWrapper>
            <DiscussionPostHeaderWrapper className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-center align-items-lg-start">
                <DiscussionPostTitleWrapper>
                    <Heading type={5} text={(values && values.title) && values.title} />
                    <Text type="span">{(values && (values.user.first_name && values.user.last_name)) && (values.user.first_name + ' ' + values.user.last_name)}</Text> <Text type="span" color="darkGray">{(values && (values.user.username)) && ('@' + values.user.username)}</Text>
                </DiscussionPostTitleWrapper>
                <MiscWrapper className="d-flex flex-column-reverse flex-md-row flex-lg-column align-items-center align-items-lg-end">
                    <Text type="span" color="darkGray">{(values && values.created_at) &&
                        new Intl.DateTimeFormat('en-US', {
                            timeZone: 'Asia/Manila',
                            hourCycle: 'h12',
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(new Date(values.created_at))}
                    </Text>
                    <Text type="paragraph">
                        Tag: <Link to={
                            "/discussions/" + ((values && values.category) && ((values.category.toLowerCase() === "science & tech") ? "science-and-tech" :
                                (values.category.toLowerCase() === "social cause") ? "social-causes" : values.category.toLowerCase()))
                        }>
                            <Text type="span" className="ms-1">
                                {(values && values.category) && values.category}
                            </Text>
                        </Link>
                    </Text>
                </MiscWrapper>
            </DiscussionPostHeaderWrapper>
            <DiscussionPostContentWrapper>
                <Text type="paragraph">{(values && values.body) && values.body}</Text>
            </DiscussionPostContentWrapper>
            <DiscussionPostMiscWrapper className="d-flex flex-column flex-xl-row">
                <MiscWrapper css={{ flex: '60%' }}>
                    <DiscussionPostReplies 
                    values={values}
                    isAuth={context.isAuth}
                    authUser={context.authUser} />
                </MiscWrapper>
                <MiscWrapper css={{ 
                    flex: '40%', 
                    background: '$lightGray',
                    borderRadius: '$default',
                }}>
                    <DiscussionPostSupporters slug={(values && values.slug) && values.slug} isAuth={context.isAuth} />
                </MiscWrapper>
            </DiscussionPostMiscWrapper>
            <Modal 
            closable={false}
            maskClosable={(action === "update") ? false : true}
            isVisible={isVisible}
            onCancel={handleHideModal}>
            {
                help && 
                <Alert status={status} icon header={header} css={{ marginBottom: '$space-4', }}>
                    {help}
                </Alert>
            }
            {
                (action && (action === "delete")) && 
                <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                    <Button
                    type="button"
                    text="Cancel"
                    className="flex-grow-1 flex-sm-grow-0"
                    onClick={() => handleHideModal()} />
                    <Button
                    type="button"
                    text="Delete"
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                    color="red"
                    onClick={() => onRemovePost()} />
                </ActionWrapper>
            }
            {
                ((action && (action === "update")) && values && (values.title && values.body && values.category && values.slug)) && 
                <UpdateDiscussionPost
                onUpdatePost={onUpdatePost}
                values={{
                    ...values, category: (values.category.toLowerCase() === "science & tech") ? "science-and-tech" : 
                    (values.category.toLowerCase() === "social cause") ? "social_cause" : values.category
                }}
                id="update-discussion"
                form={form}
                handleHideModal={handleHideModal}
                titleHelp={titleHelp}
                bodyHelp={bodyHelp}
                categoryHelp={categoryHelp} />
            }
            </Modal>
        </DiscussionPostWrapper>
    )
}

async function getDiscussionPost(slug) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "discussion-posts/get", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
            slug: slug,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function updateDiscussion(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "discussion-posts/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function removeDiscussion(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "discussion-posts/destroy", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default DiscussionPost;