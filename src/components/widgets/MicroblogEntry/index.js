import { useState, useEffect, } from 'react';
import { isAuth, key, showAlert, } from '../../../util';
import Cookies from 'js-cookie';
import { message, } from 'antd';
import { axiosInstance } from '../../../requests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faHeart, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import User from "../User";
import Text from "../../core/Text";
import Button from "../../core/Button";
import PostComment from '../PostComment';
import Comments from '../Comments';

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
    background: '$white',
    borderRadius: '$small',
    marginTop: '$space-3',
});

export const MicroblogEntry = ({ microblogEntry }) => {
    const [isPostCommentVisible, setIsPostCommentVisible] = useState(false);
    const [isCommentsGroupVisible, setIsCommentsGroupVisible] = useState(false);
    const [heartCount, setHeartCount] = useState(0);

    const handleHeartCount = heartCount => setHeartCount(heartCount);
    const handleTogglePostComment = () => setIsPostCommentVisible(!isPostCommentVisible);
    const handleToggleCommentsGroup = () => setIsCommentsGroupVisible(!isCommentsGroupVisible);

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
                    handleHeartCount(Number.isInteger(response.data.data.details) ? response.data.data.details : 0);
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

    useEffect(() => {
        let loading = true;

        if (loading && microblogEntry) {
            handleHeartCount(microblogEntry.hearts ? microblogEntry.hearts : 0);
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <MicroblogEntryWrapper>
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
                    </Text>
                </MicroblogHeaderWrapper>
            }
            css={{ borderRadius: '$default', padding: '$space-2', }}>
                <MicroblogContentWrapper>
                    <Text type="paragraph">{(microblogEntry && microblogEntry.body) && microblogEntry.body}</Text>
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
                            className="ms-1" />
                        </Text>
                        <Text 
                        type="span" 
                        color="darkGray" 
                        className="ms-2 toggle-comment" 
                        onClick={() => handleToggleCommentsGroup()}>
                            0
                            <FontAwesomeIcon icon={faComments} className="ms-1"/>
                        </Text>
                    </MicroblogStatWrapper>
                </MicroblogActionWrapper>
                <MicroblogPostCommentWrapper>
                {
                    isPostCommentVisible && 
                    <PostComment />
                }
                {
                    isCommentsGroupVisible && 
                    <Comments css={{ marginTop: '30px', }} />
                }
                </MicroblogPostCommentWrapper>
            </Card>
        </MicroblogEntryWrapper>
    )
}
export default MicroblogEntry;
