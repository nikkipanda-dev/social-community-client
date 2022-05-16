import { useState, useEffect, } from "react";
import Cookies from 'js-cookie';
import { isAuth } from "../../../util";
import { axiosInstance } from "../../../requests";
import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import Comment from '../Comment';
import Button from "../../core/Button";
import Text from "../../core/Text";

const CommentsWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

const CommentsFooterWrapper = styled('div', {});

const SubmitButtonWrapper = styled('div', {});

export const Comments = ({ 
    entrySlug,
    forceRender,
    className, 
    css,
}) => {
    const [comments, setComments] = useState('');
    const [commentsLen, setCommentsLen] = useState(0);
    const [limit, setLimit] = useState(0);

    const handleComments = comments => setComments(comments);
    const handleLimit = limit => setLimit(limit);
    const handleCommentsLen = commentsLen => setCommentsLen(commentsLen);

    const getMicroblogEntryComments = () => {
        if (isAuth() && entrySlug) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "microblog-entries/user/entry/comments", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                    slug: entrySlug,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleCommentsLen(Object.keys(response.data.data.details).length);
                    handleComments(response.data.data.details.slice(0, 5));
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response.data.errors : err);
            });
        } else {
            console.log('on microblog entries: no cookies');
        }
    }

    const getPaginatedMicroblogEntryComments = () => {
        if (isAuth() && entrySlug) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "microblog-entries/user/entry/comments/paginate", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                    slug: entrySlug,
                    limit: limit,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleComments(response.data.data.details);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log(err.response.data.errors);
                }
            });
        } else {
            console.log('on microblog comments: no cookies');
        }
    }

    const updateLimit = () => {
        ((limit && (limit + 5)) <= commentsLen) ? handleLimit(limit + 5) : handleLimit(commentsLen);
    }

    useEffect(() => {
        let loading = true;

        if (loading) {
            getMicroblogEntryComments();
        }

        return () => {
            loading = false;
        }
    }, [forceRender]);

    useEffect(() => {
        let loading = true;

        if (loading && Number.isInteger(limit)) {
            getPaginatedMicroblogEntryComments();
        }

        return () => {
            loading = false;
        }
    }, [limit]);

    useEffect(() => {
        let loading = true;

        if (loading) {
            (commentsLen > 5) && handleLimit(5);
        }

        return () => {
            loading = false;
        }
    }, [commentsLen]);
    
    return (
        <CommentsWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
        {
            (comments && (Object.keys(comments).length > 0)) &&
            Object.keys(comments).map((i, val) => {
                return <Comment 
                omitComments 
                key={Object.values(comments)[val].slug} 
                comment={Object.values(comments)[val]} />
            })
        }
            <hr />
            <CommentsFooterWrapper className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                <Text type="span" color="darkGray">Showing {limit} of {commentsLen} comments</Text>
            {
                !(limit === commentsLen) &&
                <SubmitButtonWrapper>
                    <Button
                    type="button"
                    text="Load more"
                    color="white"
                    className="flex-grow-1 flex-md-grow-0"
                    onClick={() => updateLimit()} />
                </SubmitButtonWrapper>
            }
            </CommentsFooterWrapper>
        </CommentsWrapper>
    )
}

export default Comments;