import { useState, useEffect, } from 'react';
import Cookies from 'js-cookie';
import { axiosInstance } from '../../../requests';
import { Form, message, } from 'antd';
import { key, showAlert, } from '../../../util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleInfo, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import PostComment from '../PostComment';
import Text from '../../core/Text';
import Replies from '../Replies';

const EventRepliesWrapper = styled('div', {});

export const EventReplies = ({ isAuth, slug, }) => {
    const [form] = Form.useForm();

    const [forceRender, setForceRender] = useState();
    const [help, setHelp] = useState('');
    const [status, setStatus] = useState('');
    const [header, setHeader] = useState('');
    const [updateHelp, setUpdateHelp] = useState('');
    const [replies, setReplies] = useState('');
    const [repliesLen, setRepliesLen] = useState(0);
    const [limit, setLimit] = useState(5);

    const handleForceRender = () => setForceRender(!forceRender);
    const handleHelp = help => setHelp(help);
    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleUpdateHelp = updateHelp => setUpdateHelp(updateHelp);
    const handleLimit = limit => setLimit(limit);
    const handleReplies = replies => setReplies(replies);
    const handleRepliesLen = repliesLen => setRepliesLen(repliesLen);

    const handlePostedComment = value => {
        if (!(isAuth)) {
            console.error('on store reply: no cookies');
            return;
        }

        if (isAuth && slug) {
            const storeForm = new FormData();
            storeForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            storeForm.append('slug', slug);

            for (let i in value) {
                value[i] && storeForm.append(i, value[i]);
            }

            storeReply(storeForm).then(response => {
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
            });
        }
    }

    useEffect(() => {
        let loading = true;

        if (!(isAuth)) {
            console.error('on get replies: no cookies');
            return;
        }

        if (loading && isAuth && slug) {
            getReplies(slug).then(response => {
                console.log('res ', response.data)
                if (!(response.data.isSuccess)) {
                    console.error('err get replies ', response.data.data.errorText);
                    return;
                }

                handleReplies(response.data.data.details.slice(0, 5));
                handleRepliesLen(Object.keys(response.data.data.details).length);
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

        if (loading && isAuth && slug && Number.isInteger(limit)) {
            getPaginatedReplies(slug, limit).then(response => {
                if (!(response.data.isSuccess)) {
                    console.error('err ', response.data.data.errorText);
                    return;
                }

                response.data.isSuccess && handleReplies(response.data.data.details);
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.error('err ', err.response.data.errors);
                }
            })
        }

        return () => {
            loading = false;
        }
    }, [limit]);

    return (
        <EventRepliesWrapper>
            <PostComment storeFn={handlePostedComment} form={form} />
            <Replies 
            help={help}
            css={{ marginTop: '$space-3', }}
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
        </EventRepliesWrapper>
    )
}

async function getReplies(slug) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "events/replies/get", {
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

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "events/replies/paginate", {
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

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "events/replies/store", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function updateReply(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "events/replies/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function removeReply(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "events/replies/destroy", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function onHeartReplyClick(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "events/replies/hearts/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default EventReplies;