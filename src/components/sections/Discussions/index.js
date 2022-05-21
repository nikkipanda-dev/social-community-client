import { useState, useEffect, useMemo, } from "react";
import { useOutletContext, } from "react-router-dom";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { styled } from "../../../stitches.config";

import DiscussionPostCard from "../../widgets/DiscussionPostCard";

const DiscussionsWrapper = styled('div', {});

export const Discussions = () => {
    const context = useOutletContext();

    const [discussionPosts, setDiscussionPosts] = useState('');

    const handleDiscussionPosts = discussionPosts => setDiscussionPosts(discussionPosts);

    useEffect(() => {
        let loading = true;

        if (loading && context.isAuth) {
            getDiscussions().then (response => {
                if (response.data.isSuccess) {
                    handleDiscussionPosts(response.data.data.details);
                }
            })

            .catch (err => {
                console.error('err discussions ', err.response.data.errors);
            })
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <DiscussionsWrapper>
        {
            (discussionPosts && (Object.keys(discussionPosts).length > 0)) && 
            Object.keys(discussionPosts).map((_, val) => 
                <DiscussionPostCard key={Object.values(discussionPosts)[val].slug} values={Object.values(discussionPosts)[val]} />
            )
        }
        </DiscussionsWrapper>
    )
}

async function getDiscussions() {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "discussion-posts", {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default Discussions;