import { useState, useEffect, } from "react";
import Cookies from 'js-cookie';
import { isAuth } from "../../../util";
import { axiosInstance } from "../../../requests";
import { styled } from "../../../stitches.config";

import Comment from '../Comment';

const CommentsWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

export const Comments = ({ 
    entrySlug,
    forceRender,
    className, 
    css,
}) => {
    const [comments, setComments] = useState('');

    const handleComments = comments => setComments(comments);

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
                console.log('res ', response.data);
                if (response.data.isSuccess) {
                    handleComments(response.data.data.details);
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

    useEffect(() => {
        let loading = true;

        if (loading) {
            getMicroblogEntryComments();
        }

        return () => {
            loading = false;
        }
    }, [forceRender]);

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
        </CommentsWrapper>
    )
}

export default Comments;