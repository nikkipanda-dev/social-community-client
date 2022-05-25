import { useState, useEffect, } from "react";
import { isAuth, key, showAlert, } from "../../../util";
import Cookies from 'js-cookie';
import { message, } from "antd";
import { axiosInstance } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faHeart, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Card from '../../core/Card';
import Image from "../../core/Image";
import Button from "../../core/Button";
import Text from "../../core/Text";

const CommentWrapper = styled('div', {});

const AvatarWrapper = styled('div', {});

const CommentDetailsWrapper = styled('div', {});

const CommentBodyWrapper = styled('div', {
    padding: '$space-3',
    background: '$lightGray',
    borderRadius: '$small',
});

const CommentHeaderWrapper = styled('div', {});

const CommentContentWrapper = styled('div', {
    padding: '$space-2 $space-2 1px $space-2',
    background: '$white',
    borderRadius: '$small',
    marginTop: '$space-3',
});

const CommentActionWrapper = styled('div', {
    marginTop: '$space-3',
});

const CommentStatWrapper = styled('div', {
    'span.toggle-comment:hover, span.toggle-heart:hover': {
        cursor: 'pointer',
    },
});

export const Comment = ({ 
    comment,
    omitComments,
}) => {    
    const [isHeart, setIsHeart] = useState(false);
    const [commentHeartCount, setCommentHeartCount] = useState(0);
    
    const handleShowHeart = () => setIsHeart(true);
    const handleHideHeart = () => setIsHeart(false);
    const handleHeartComment = heartCount => setCommentHeartCount(heartCount);
    
    useEffect(() => {
        let loading = true;

        if (loading && (comment && comment.hearts)) {
            (comment.hearts && comment.hearts.is_heart) ? handleShowHeart() : handleHideHeart();
            handleHeartComment((comment.hearts && comment.hearts.count) ? comment.hearts.count : 0);
        }

        return () => {
            loading = false;
        }
    }, []);

    const onHeartCommentClick = () => {
        const microblogCommentLoveForm = new FormData();

        if (isAuth() && (comment && comment.slug)) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            microblogCommentLoveForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            microblogCommentLoveForm.append('slug', comment.slug);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "microblog-entries/user/entry/comment/hearts/update", microblogCommentLoveForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    (response.data.data.details && response.data.data.details.is_heart) ? handleShowHeart() : handleHideHeart();
                    handleHeartComment(Number.isInteger(response.data.data.details.count) ? response.data.data.details.count : 0);
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

    return (
        <CommentWrapper>
            <Card css={{
                marginLeft: '$space-4',
                borderRadius: '$default',
            }}>
                <CommentDetailsWrapper className="d-flex">
                    <AvatarWrapper style={{ maxWidth: '60px', }}>
                        <Image src="/avatar_medium.png" css={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                        }} />
                    </AvatarWrapper>
                    <CommentBodyWrapper className="flex-grow-1 d-flex flex-column ms-3">
                        <CommentHeaderWrapper className="d-flex justify-content-between">
                            <Text type="span">@{(comment && comment.user.username) && comment.user.username}</Text>
                            <Text type="span" color="darkGray">
                            {
                                (comment && comment.created_at) &&
                                new Intl.DateTimeFormat('en-US', {
                                    timeZone: 'Asia/Manila',
                                    hourCycle: 'h12',
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }).format(new Date(comment.created_at))
                            }
                            </Text>
                        </CommentHeaderWrapper>
                        <CommentContentWrapper>
                            <Text type="paragraph" css={{ textAlign: 'justify', marginTop: '$space-2', }}>{(comment && comment.body) && comment.body}</Text>
                        </CommentContentWrapper>
                        <CommentActionWrapper className={"d-flex" + (!(omitComments) ? " justify-content-between " : " justify-content-end ") + "align-items-center"}>
                        {
                            !(omitComments) && 
                            <Button
                            type="button"
                            text="Comment"
                            color="white" />
                        }
                            <CommentStatWrapper className="d-flex flex-wrap">
                                <Text
                                type="span"
                                color="darkGray"
                                className="toggle-heart"
                                onClick={() => onHeartCommentClick()}>
                                    {commentHeartCount}
                                    <FontAwesomeIcon
                                    icon={faHeart}
                                    className="ms-1"
                                    {...isHeart && { style: { color: '#F95F5F', } }} />
                                </Text>
                            {
                                !(omitComments) && 
                                <Text type="span" color="darkGray" className="ms-2">
                                    0
                                    <FontAwesomeIcon icon={faComments} className="ms-1" />
                                </Text>
                            }
                            </CommentStatWrapper>
                        </CommentActionWrapper>
                    </CommentBodyWrapper>
                </CommentDetailsWrapper>
            </Card>
        </CommentWrapper>
    )
}

export default Comment;