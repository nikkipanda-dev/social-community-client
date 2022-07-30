import { useState, useEffect, } from 'react';
import Cookies from 'js-cookie';
import { axiosInstance } from '../../../requests';
import { Form, message, } from 'antd';
import { key, showAlert, } from '../../../util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    doc,
    getDoc,
    setDoc,
    updateDoc, 
} from 'firebase/firestore';
import { db, } from '../../../util/Firebase';
import { faCircleCheck, faCircleInfo, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import PostComment from '../PostComment';
import Replies from '../Replies';
import Text from '../../core/Text';

const DiscussionPostRepliesWrapper = styled('div', {});

export const DiscussionPostReplies = ({ 
    values,
    isAuth,
    authUser,
}) => {
    const [form] = Form.useForm();

    const [forceRender, setForceRender] = useState();
    const [help, setHelp] = useState('');
    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');
    const [updateHelp, setUpdateHelp] = useState('');
    const [replies, setReplies] = useState('');
    const [repliesLen, setRepliesLen] = useState(0);
    const [limit, setLimit] = useState(5);
    const [newReply, setNewReply] = useState('');

    const handleForceRender = () => setForceRender(!forceRender);
    const handleHelp = help => setHelp(help);
    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleUpdateHelp = updateHelp => setUpdateHelp(updateHelp);
    const handleReplies = replies => setReplies(replies);
    const handleLimit = limit => setLimit(limit);
    const handleRepliesLen = repliesLen => setRepliesLen(repliesLen);
    const handleNewReply = newReply => setNewReply(newReply);

    const handlePostedReply = value => {
        if (!(isAuth)) {
            console.error('on store replies: no cookies');
            return;
        }

        if (isAuth && values) {
            const storeReplyForm = new FormData();
            storeReplyForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            storeReplyForm.append('slug', values.slug);

            for (let i in value) {
                value[i] && storeReplyForm.append(i, value[i]);
            }

            storeReply(storeReplyForm).then(response => {
                showAlert();

                if (!(response.data.isSuccess)) {
                    setTimeout(() => {
                        message.open({
                            content: <><FontAwesomeIcon icon={faCircleInfo} className="me-2" /><Text type="span" className="fa-xl">{response.data.data.errorText}</Text></>,
                            key,
                            style: {
                                marginTop: '25vh',
                                zIndex: '99999999',
                            },
                        });
                    }, 1000);
                    return;
                }

                form.resetFields();
                handleForceRender();
                handleNewReply(response.data.data.details[0]);

                setTimeout(() => {
                    message.open({
                        content: <><FontAwesomeIcon icon={faCircleCheck} className="me-2" style={{ color: '#007B70', }} /><Text type="span" className="fa-xl">Posted.</Text></>,
                        key,
                        style: {
                            marginTop: '25vh',
                            zIndex: '99999999',
                        },
                    });
                }, 1000);
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.error('err ', err.response.data.errors);
                }
            })
        }
    }

    useEffect(() => {
        let loading = true;

        if (!(isAuth)) {
            console.error('on get replies: no cookies');
            return;
        }

        if (loading && isAuth && values) {
            getReplies(values.slug).then(response => {   
                if (!(response.data.isSuccess)) {
                    console.error('err get replies ', response.data.data.errorText);
                    return;
                }

                if (response.data.isSuccess) {
                    handleReplies(response.data.data.details.slice(0, 5));
                    handleRepliesLen(Object.keys(response.data.data.details).length);
                }
            })

            .catch(err => {
                console.error('err ', err.response ? err.response.data.errors : err);
            })
        }

        return () => {
            loading = false;
        }
    }, [forceRender]);

    useEffect(() => {
        let loading = true;

        if (loading && isAuth && values && Number.isInteger(limit)) {
            getPaginatedReplies(values.slug, limit).then(response => {
                if (!(response.data.isSuccess)) {
                    console.error('err ', response.data.data.errorText);
                    return;
                }

                response.data.isSuccess && handleReplies(response.data.data.details);
            })

            .catch (err => {
                console.error('err ', err.response && err.response.data.errors);
            })
        }

        return () => {
            loading = false;
        }
    }, [limit]);

    useEffect(() => {
        let loading = true;

        if (loading && newReply && values && (values.user.username !== authUser.username)) {
            const notifications = doc(db, "notifications", values.user.username);

            getDoc(notifications).then(res => {
                if (res.exists()) {
                    let formatted = [];

                    if (res.data().new.discussion_posts && res.data().new.discussion_posts) {
                        formatted = [...res.data().new.discussion_posts];
                    }

                    formatted.push({
                        user: authUser.username,
                        body: newReply.body,
                        post_slug: values.slug,
                        comment_slug: newReply.slug,
                        is_comment: true,
                        is_heart: false,
                    });

                    updateDoc(notifications, {
                        "new.discussion_posts": formatted,
                    });
                } else {
                    setDoc(notifications, {
                        new: {
                            discussion_posts: {
                                user: authUser.username,
                                body: newReply.body,
                                post_slug: values.slug,
                                comment_slug: newReply.slug,
                                is_comment: true,
                                is_heart: false,
                            },
                        }
                    });
                }
            });
        }

        return () => {
            loading = false;
        }
    }, [newReply]);

    return (
        <DiscussionPostRepliesWrapper>
            <PostComment storeFn={handlePostedReply} form={form} />
            <Replies 
            css={{ marginTop: '$space-3', }}
            help={help}
            status={status}
            header={header}
            handleHelp={handleHelp}
            handleStatus={handleStatus}
            handleHeader={handleHeader}
            updateHelp={updateHelp}
            handleUpdateHelp={handleUpdateHelp}
            replies={replies} 
            handleForceRender={handleForceRender}
            isAuth={isAuth}
            repliesLen={repliesLen}
            limit={limit}
            handleLimit={handleLimit}
            onHeartReplyClick={onHeartReplyClick}
            updateReply={updateReply}
            removeReply={removeReply} />
        </DiscussionPostRepliesWrapper>
    )
}

async function getReplies(slug) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "discussion-posts/replies/get", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
            slug: slug,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function getPaginatedReplies(slug, limit) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "discussion-posts/replies/paginate", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
            slug: slug,
            limit: limit,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function storeReply(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "discussion-posts/replies/store", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function updateReply(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "discussion-posts/replies/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function removeReply(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "discussion-posts/replies/destroy", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function onHeartReplyClick(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "discussion-posts/post/hearts/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default DiscussionPostReplies;