import { 
    useState, 
    useEffect, 
} from "react";
import { Dropdown, Menu, } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHeart,
    faPencil,
    faTrash,
    faCaretDown,
    faCaretUp,
} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import Image from "../../core/Image";
import Text from "../../core/Text";
import Modal from "../Modal";
import Button from "../../core/Button";
import Alert from "../../core/Alert";
import UpdateDiscussionReply from "../UpdateDiscussionReply";

const ReplyWrapper = styled('div', {});

const ReplyDetailsWrapper = styled('div', {});

const AvatarWrapper = styled('div', {});

const ReplyBodyWrapper = styled('div', {});

const ReplyHeaderWrapper = styled('div', {});

const ReplyContentWrapper = styled('div', {});

const ReplyActionWrapper = styled('div', {});

const ActionWrapper = styled('div', {
    marginTop: '$space-3',
});

const CommentStatWrapper = styled('div', {
    'span.toggle-comment:hover, span.toggle-heart:hover': {
        cursor: 'pointer',
    },
});

export const Reply = ({ 
    values, 
    handleForceRender,
    isAuth,
    header,
    status,
    help,
    updateHelp,
    handleUpdateHelp,
    handleHelp,
    handleStatus,
    handleHeader,
    updateReply,
    removeReply,
    onHeartReplyClick,
}) => {    
    const [replyValues, setReplyValues] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isHeart, setIsHeart] = useState(false);
    const [action, setAction] = useState('');
    const [arrowIcon, setArrowIcon] = useState(faCaretDown);
    const [replyHeartCount, setReplyHeartCount] = useState(0);

    const handleReplyValues = replyValues => setReplyValues(replyValues);
    const handleAction = action => setAction(action);
    const handleActionIcon = icon => setArrowIcon(icon);
    const handleShowModal = () => setIsVisible(true);
    const handleHideModal = () => {
        handleHelp('');
        setIsVisible(false);
    };
    const handleShowHeart = () => setIsHeart(true);
    const handleHideHeart = () => setIsHeart(false);
    const handleHeartCount = replyHeartCount => setReplyHeartCount(replyHeartCount);

    const handleShowModalUpdate = () => {
        handleAction('update');
        handleShowModal();
    }

    const handleShowModalDelete = () => {
        handleAction('delete');
        handleHeader("Confirmation");
        handleStatus('warning');
        handleHelp(<Text type="span">You cannot undo this action. Remove reply?</Text>);
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

    const onUpdateReply = value => {
        if (!(isAuth)) {
            console.error('on update replies: no cookies');
            return;
        }

        if (isAuth && replyValues.slug) {
            const updateReplyForm = new FormData();
            updateReplyForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            updateReplyForm.append('slug', replyValues.slug);

            for (let i in value) {
                value[i] && updateReplyForm.append(i, value[i]);
            }

            updateReply(updateReplyForm).then(response => {
                if (!(response.data.isSuccess)) {
                    handleHeader("Alert");
                    handleStatus('info');
                    handleHelp(response.data.data.errorText);
                    return;
                }

                handleHeader("Updated");
                handleStatus('success');
                handleHelp(<Text type="span">Going back...</Text>);
                handleReplyValues(response.data.data.details);
                setTimeout(() => {
                    handleHideModal();
                }, 1500);
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    handleUpdateHelp(<Text type="span">{err.response.data.errors.body[0]}</Text>)
                }
            });
        }
    }

    const onRemoveReply = () => {
        if (!(isAuth)) {
            console.error('on remove replies: no cookies');
            return;
        }

        if (isAuth && replyValues.slug) {
            const removeReplyForm = new FormData();
            removeReplyForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            removeReplyForm.append('slug', replyValues.slug);

            removeReply(removeReplyForm).then(response => {
                if (!(response.data.isSuccess)) {
                    handleHeader("Alert");
                    handleStatus('info');
                    handleHelp(response.data.data.errorText);
                    return;
                }

                handleHeader("Reply deleted");
                handleStatus('success');
                handleHelp(<Text type="span">Updating replies...</Text>);
                handleForceRender();
                setTimeout(() => {
                    handleHideModal();
                }, 1500);
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    handleUpdateHelp(<Text type="span">{err.response.data.errors.body[0]}</Text>)
                }
            });
        }
    }

    const onHeartClick = () => {
        if (!(isAuth)) {
            console.error('on heart click: no cookies');
            return;
        }

        if (isAuth && replyValues.slug) {
            const heartForm = new FormData();
            heartForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            heartForm.append('slug', replyValues.slug);

            onHeartReplyClick(heartForm).then(response => {
                if (!(response.data.isSuccess)) {
                    console.error('heart res err ', response.data.data.errorText);
                    return;
                }

                (response.data.data.details && (response.data.data.details.count >= 0)) && handleHeartCount(response.data.data.details.count);
                (response.data.data.details && response.data.data.details.is_heart) ? handleShowHeart() : handleHideHeart();
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    // handleUpdateHelp(<Text type="span">{err.response.data.errors.body[0]}</Text>)
                }
            });
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading && (values && (Object.keys(values).length > 0))) {
            handleReplyValues(values);
            (values.heartDetails && values.heartDetails.count) && handleHeartCount(values.heartDetails.count);
            (values.heartDetails && values.heartDetails.is_heart) && handleShowHeart();
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <ReplyWrapper>
            <Card css={{
                padding: '$space-2',
                borderRadius: '$default',
            }}>
                <ReplyDetailsWrapper className="d-flex">
                    <AvatarWrapper style={{ maxWidth: '60px', }}>
                        <Image src="/avatar_medium.png" css={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                        }} />
                    </AvatarWrapper>
                    <ReplyBodyWrapper className="flex-grow-1 d-flex flex-column ms-3">
                        <ReplyHeaderWrapper className="d-flex justify-content-between">
                            <Text type="span">@{(replyValues && replyValues.user.username) && replyValues.user.username}</Text>
                            <Text type="span" color="darkGray">
                            {
                                (replyValues && replyValues.created_at) &&
                                new Intl.DateTimeFormat('en-US', {
                                    timeZone: 'Asia/Manila',
                                    hourCycle: 'h12',
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }).format(new Date(replyValues.created_at))
                            }
                            {
                                (isAuth && (replyValues && replyValues.user && (replyValues.user.username === JSON.parse(Cookies.get('auth_user')).username))) && 
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
                        </ReplyHeaderWrapper>
                        <ReplyContentWrapper>
                            <Text type="paragraph" css={{ textAlign: 'justify', marginTop: '$space-2', }}>{(replyValues && replyValues.body) && replyValues.body}</Text>
                        </ReplyContentWrapper>
                        <ReplyActionWrapper className={"d-flex justify-content-end align-items-center"}>
                            <CommentStatWrapper className="d-flex flex-wrap">
                                <Text
                                type="span"
                                color="darkGray"
                                className="toggle-heart"
                                onClick={() => onHeartClick()}>
                                {replyHeartCount}
                                    <FontAwesomeIcon
                                    icon={faHeart}
                                    className="ms-1"
                                    style={{ color: isHeart ? '#F95F5F' : '#666666' }} />
                                </Text>
                            </CommentStatWrapper>
                        </ReplyActionWrapper>
                    </ReplyBodyWrapper>
                </ReplyDetailsWrapper>
            </Card>
            <Modal
            isVisible={isVisible}
            onCancel={handleHideModal}
            closable={false}
            maskClosable={true}>
            { 
                (help) && 
                <Alert 
                status={status} 
                icon 
                header={header} 
                css={{ marginBottom: '$space-3', }}>
                    {help}
                </Alert>   
            }
            {
                (action && (action === 'update') && (replyValues && (Object.keys(replyValues).length > 0))) && 
                <UpdateDiscussionReply 
                values={{
                    body: replyValues.body,
                    slug: replyValues.slug,
                }}
                onUpdateReply={onUpdateReply} 
                updateHelp={updateHelp}
                handleHideModal={handleHideModal} />
            }
            {
                (action && (action === 'delete')) &&
                <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-md-center">
                    <Button
                    type="button"
                    text="Cancel"
                    className="flex-grow-1 flex-sm-grow-0"
                    onClick={() => handleHideModal()} />
                    <Button
                    type="button"
                    text="Remove"
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                    color="red"
                    onClick={() => onRemoveReply()} />
                </ActionWrapper>
            }
            </Modal>
        </ReplyWrapper>
    )
}

export default Reply;