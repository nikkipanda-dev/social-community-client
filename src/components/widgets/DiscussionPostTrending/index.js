import { useState, useEffect, } from "react";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import TrendingDiscussionCard from "../TrendingDiscussionCard";

const DiscussionPostTrendingWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

export const DiscussionPostTrending = ({ isAuth, slug, }) => {

    const [posts, setPosts] = useState('');

    const handlePosts = posts => setPosts(posts);

    useEffect(() => {
        let loading = true;

        if (!(isAuth)) {
            console.error('err get trending: no cookies');
            return;
        }

        if (loading && isAuth) {
            getTrending().then(response => {
                if (!(response.data.isSuccess)) {
                    console.error('err get trending ', response.data.data.errorText);
                    return;
                }

                response.data.isSuccess && handlePosts(response.data.data.details);
            })

            .catch(err => {
                if (err.response && err.response.data.e) {
                    console.error('err get trending ', err.response.data.errors);
                }
            });
        }

        return () => {
            loading = false;
        }
    }, [slug]);

    return (
        <DiscussionPostTrendingWrapper>
            <Text type="span" size="large">Trending</Text>
        {
            (posts && (Object.keys(posts).length > 0)) && 
            Object.keys(posts).map((i, val) => <TrendingDiscussionCard key={Object.values(posts)[val].slug} values={Object.values(posts)[val]} />)
        }
        </DiscussionPostTrendingWrapper>
    )
}

async function getTrending() {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "discussion-posts/trending/get", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default DiscussionPostTrending;