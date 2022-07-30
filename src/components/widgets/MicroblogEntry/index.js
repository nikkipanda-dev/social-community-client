import { 
    useState, 
    useEffect, 
    useRef,
} from 'react';
import { 
    isAuth, 
    key, 
    showAlert,
} from '../../../util';
import { useParams, } from 'react-router-dom';
import Cookies from 'js-cookie';
import { 
    message, 
    Form, 
    Menu, 
    Dropdown,
} from 'antd';
import { axiosInstance } from '../../../requests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faComments, 
    faHeart, 
    faCircleCheck,
    faCaretDown,
    faCaretUp,
    faTrash,
    faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { 
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp,
} from 'firebase/firestore';
import { db, auth, } from '../../../util/Firebase';
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import User from "../User";
import Text from "../../core/Text";
import Button from "../../core/Button";
import PostComment from '../PostComment';
import Comments from '../Comments';
import Modal from '../Modal';
import UpdateMicroblog from '../UpdateMicroblog';
import DeleteMicroblogEntry from '../DeleteMicroblogEntry';

const MicroblogEntryWrapper = styled('div', {});

const MicroblogHeaderWrapper = styled('div', {});

const MicroblogContentWrapper = styled('div', {
    padding: '$space-3 $space-3 1px $space-3',
    background: '$white',
    borderRadius: '$small',
    marginTop: '$space-3',
});

const MicroblogActionWrapper = styled('div', {
    marginTop: '$space-3',
});

const MicroblogStatWrapper = styled('div', {
    'span.toggle-comment:hover, span.toggle-heart:hover': {
        cursor: 'pointer',
    },
});

const MicroblogPostCommentWrapper = styled('div', {
    borderRadius: '$small',
    marginTop: '$space-3',
});

export const MicroblogEntry = ({ microblogEntry, authUser, }) => {    
    const [form] = Form.useForm();
    const entryRef = useRef();
    const params = useParams();

    const [isVisible, setIsVisible] = useState(false);
    const [values, setValues] = useState('');
    const [arrowIcon, setArrowIcon] = useState(faCaretDown);
    const [isPostCommentVisible, setIsPostCommentVisible] = useState(false);
    const [action, setAction] = useState('');
    const [help, setHelp] = useState('');
    const [forceRender, setForceRender] = useState(false);
    const [isCommentsGroupVisible, setIsCommentsGroupVisible] = useState(false);
    const [isHeart, setIsHeart] = useState(false);
    const [heartCount, setHeartCount] = useState(0);
    const [newComment, setNewComment] = useState('');

    const handleShowModal = () => setIsVisible(true);
    const handleHideModal = () => setIsVisible(false);
    const handleAction = action => setAction(action);
    const handleValues = values => setValues(values);
    const handleActionIcon = icon => setArrowIcon(icon);

    const handleShowHeart = () => setIsHeart(true);
    const handleHideHeart = () => setIsHeart(false);
    const handleHeartCount = heartCount => setHeartCount(heartCount);
    const handleForceRender = () => setForceRender(!forceRender);
    const handleTogglePostComment = () => setIsPostCommentVisible(!isPostCommentVisible);
    const handleToggleCommentsGroup = () => setIsCommentsGroupVisible(!isCommentsGroupVisible);
    const handlePaginateComment = () => window.scrollTo(0, ((entryRef.current.getBoundingClientRect().top + window.scrollY)) - 100);
    const handleNewComment = newComment => setNewComment(newComment);

    const handleShowModalUpdate = () => {
        handleAction('update');
        handleShowModal();
    }

    const handleShowModalDelete = () => {
        handleAction('delete');
        handleShowModal();
    }

    const menu = (
        <Menu
            items={[
                {
                    label: <Text type="span" onClick={() => handleShowModalUpdate()}><FontAwesomeIcon 
                    icon={faPencil} 
                    className="fa-md fa-fw" 
                    style={{ color: '#666666', }} /> Update</Text>
                },
                {
                    label: <Text type="span" onClick={() => handleShowModalDelete()}><FontAwesomeIcon 
                    icon={faTrash} 
                    className="fa-md fa-fw" 
                    style={{ color: '#F95F5F', }} /> Delete</Text>,
                },
            ]}
        />
    );

    const handleCaretUpIcon = () => {
        handleActionIcon(faCaretUp);
    }

    const handleCaretDownIcon = () => {
        handleActionIcon(faCaretDown);
    }

    const onHeartClick = () => {
        const microblogLoveForm = new FormData();

        if (isAuth() && (microblogEntry && microblogEntry.slug)) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            microblogLoveForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            microblogLoveForm.append('slug', microblogEntry.slug);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "microblog-entries/user/entry/hearts/update", microblogLoveForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    console.log(response.data.data.details);
                    (response.data.data.details && response.data.data.details.is_heart) ? handleShowHeart() : handleHideHeart();
                    handleHeartCount(Number.isInteger(response.data.data.details.count) ? response.data.data.details.count : 0);
                } else {
                    showAlert();
                    setTimeout(() => {
                        message.info({
                            content: <Text type="span">{response.data.data.errorText}</Text>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '10vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response.data.errors : err);
                // if (err.response && err.response.data.errors && err.response.data.errors.body) {
                //     setHelp(<Text type="span" color="red">{err.response.data.errors.body[0]}</Text>);
                // }
            });
        } else {
            console.log('on microblog heart: no cookies');
        }
    }

    const handlePostedComment = comment => {
        handleNewComment(comment);
        handleForceRender();
        form.resetFields();
    }

    const storeComment = value => {
        if (isAuth() && (microblogEntry && microblogEntry.slug)) {
            const microblogCommentForm = new FormData();

            for (let i in value) {
                value[i] && microblogCommentForm.append(i, value[i]);
            }
            
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            microblogCommentForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            microblogCommentForm.append('slug', microblogEntry.slug);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "microblog-entries/user/entry/comment/store", microblogCommentForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handlePostedComment(response.data.data.details[0]);
                    showAlert();
                    setTimeout(() => {
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
                        message.info({
                            content: <Text type="span">{response.data.data.errorText}</Text>,
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
                console.log('err ', err.response ? err.response.data.errors : err);
                if (err.response && err.response.data.errors && err.response.data.errors.body) {
                    setHelp(<Text type="span" color="red">{err.response.data.errors.body[0]}</Text>);
                }
            });
        } else {
            console.log('on microblog comment: no cookies');
        }
    }

    const removeEntry = () => {
        entryRef.current.remove();
    }

    useEffect(() => {
        let loading = true;

        if (loading && (microblogEntry && (Object.keys(microblogEntry).length > 0))) {
            (microblogEntry.hearts && microblogEntry.hearts.is_heart) ? handleShowHeart() : handleHideHeart();
            handleValues(microblogEntry);
            handleHeartCount((microblogEntry.hearts && microblogEntry.hearts.count) ? microblogEntry.hearts.count : 0);
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;

        if (loading && newComment && (params.username !== authUser.username)) {
            const notifications = doc(db, "notifications", params.username);

            getDoc(notifications).then(res => {
                if (res.exists()) {
                    let formatted = [];

                    if (res.data().new.microblog_posts && res.data().new.microblog_posts) {
                        formatted = [...res.data().new.microblog_posts];
                    }

                    formatted.push({
                        user: authUser.username,
                        body: newComment.body,
                        post_slug: microblogEntry.slug,
                        comment_slug: newComment.slug,
                        is_comment: true,
                        is_heart: false,
                    });

                    updateDoc(notifications, {
                        "new.microblog_posts": formatted,
                    });
                } else {
                    setDoc(notifications, {
                        new: {
                            microblog_posts: {
                                user: authUser.username,
                                body: newComment.body,
                                post_slug: microblogEntry.slug,
                                comment_slug: newComment.slug,
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
    }, [newComment]);

    return (
        <MicroblogEntryWrapper ref={entryRef}>
            <Card header={
                <MicroblogHeaderWrapper className="d-flex justify-content-between">
                    <User type="item" member={(microblogEntry && microblogEntry.user) && microblogEntry.user} />
                    <Text 
                    type="span" 
                    color="darkGray" 
                    css={{ margin: '$space-2', }}>
                    {
                        (microblogEntry && microblogEntry.created_at) && 
                        new Intl.DateTimeFormat('en-US', {
                            timeZone: 'Asia/Manila',
                            hourCycle: 'h12',
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(new Date(microblogEntry.created_at))
                    }
                    {
                        (isAuth() && (values && values.user && values.user.username) && (JSON.parse(Cookies.get('auth_user')).username ===  values.user.username)) && 
                        <Dropdown overlay={menu} trigger={['click', 'hover']}>
                            <a
                            onClick={e => e.preventDefault()}
                            onMouseEnter={() => handleCaretUpIcon()}
                            onMouseLeave={() => handleCaretDownIcon()}>
                                <FontAwesomeIcon
                                icon={arrowIcon}
                                className="fa-xl fa-fw"
                                style={{ color: '#666666', }} />
                            </a>
                        </Dropdown>
                    }
                    </Text>
                </MicroblogHeaderWrapper>
            }
            css={{ borderRadius: '$default', padding: '$space-2', }}>
                <MicroblogContentWrapper>
                    <Text type="paragraph">{(values && values.body) && values.body}</Text>
                </MicroblogContentWrapper>
                <MicroblogActionWrapper className="d-flex justify-content-between align-items-center">
                    <Button 
                    type="button" 
                    css={{ fontWeight: 'normal', }}
                    text={isPostCommentVisible ? "Cancel" : "Comment"} 
                    onClick={() => handleTogglePostComment()}
                    color="white" />
                    <MicroblogStatWrapper className="d-flex flex-wrap">
                        <Text 
                        type="span" 
                        color="darkGray" 
                        className="toggle-heart"
                        onClick={() => onHeartClick()}>
                            {heartCount}
                            <FontAwesomeIcon 
                            icon={faHeart} 
                            className="ms-1"
                            {...isHeart && { style: { color: '#F95F5F', } }} />
                        </Text>
                        <Text 
                        type="span" 
                        color="darkGray" 
                        className="ms-2 toggle-comment" 
                        onClick={() => handleToggleCommentsGroup()}>
                            {(microblogEntry && microblogEntry.comments) && microblogEntry.comments}
                            <FontAwesomeIcon icon={faComments} className="ms-1"/>
                        </Text>
                    </MicroblogStatWrapper>
                </MicroblogActionWrapper>
                <MicroblogPostCommentWrapper>
                {
                    isPostCommentVisible && 
                    <PostComment 
                    storeFn={storeComment} 
                    form={form} />
                }
                {
                    (isCommentsGroupVisible && (microblogEntry && microblogEntry.slug)) && 
                    <Comments 
                    newComment={newComment}
                    entrySlug={microblogEntry.slug} 
                    handlePaginateComment={handlePaginateComment}
                    css={{ marginTop: '40px', }}
                    forceRender={forceRender} />
                }
                </MicroblogPostCommentWrapper>
            </Card>
            <Modal
            closable
            maskClosable
            isVisible={isVisible}
            width="550px"
            wrapClassName="test"
            onCancel={handleHideModal}>
            {
                (action && (action === 'update')) &&
                <UpdateMicroblog
                values={microblogEntry}
                handleValues={handleValues}
                handleHideModal={handleHideModal} />
            }
            {
                (action && (action === 'delete')) &&
                <DeleteMicroblogEntry 
                values={values} 
                handleHideModal={handleHideModal}
                removeEntry={removeEntry} />
            }
            </Modal>
        </MicroblogEntryWrapper>
    )
}
export default MicroblogEntry;
