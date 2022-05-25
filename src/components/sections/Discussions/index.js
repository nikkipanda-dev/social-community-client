import { 
    useState, 
    useEffect,
    useRef,
} from "react";
import { useOutletContext, } from "react-router-dom";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { styled } from "../../../stitches.config";

import PostDiscussion from "../../widgets/PostDiscussion";
import DiscussionPosts from "../../widgets/DiscussionPosts";

const DiscussionsWrapper = styled('div', {
    width: '100%',
});

export const Discussions = () => {
    const ref = useRef('');
    const context = useOutletContext();

    const [forceRender, setForceRender] = useState('');
    const [discussionPosts, setDiscussionPosts] = useState('');
    const [discussionsLen, setDiscussionsLen] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(null);

    const handleForceRender = () => setForceRender(!forceRender);
    const handleDiscussionPosts = discussionPosts => setDiscussionPosts(discussionPosts);
    const handleDiscussionsLen = discussionsLen => setDiscussionsLen(discussionsLen);
    const handlePageCount = pageCount => setPageCount(pageCount);
    const handleOffset = offset => setOffset(offset);

    const handlePageClick = evt => {
        (!(evt < 0) && (evt < pageCount)) && handleOffset((((evt + 1) * 10) - 10));
    };

    const onClick = evt => {
        handlePageClick(evt.selected)
    };

    useEffect(() => {
        let loading = true;

        if (loading && context.isAuth) {
            getDiscussions(context.category ? context.category : null).then (response => {
                if (response.data.isSuccess) {
                    console.log('res get all ', response.data.data.details);
                    handleDiscussionsLen(Object.keys(response.data.data.details).length);
                    handleDiscussionPosts(response.data.data.details.slice(0, 10));
                    (Object.keys(response.data.data.details).length > 10) ? handlePageCount(Math.ceil(Object.keys(response.data.data.details).length / 10)) : handlePageCount(1);
                } else {
                    console.error('get discussions ', response.data.data.errorText);
                }
            })

            .catch (err => {
                if (err.response && err.response.data.errors) {
                    console.error('err discussions ', err.response.data.errors);
                }
            })
        }

        return () => {
            loading = false;
        }
    }, [forceRender, context.category]);

    useEffect(() => {
        let loading = true;

        if (loading && context.isAuth && Number.isInteger(offset)) {
            getPaginatedDiscussions(context.category ? context.category : null, offset).then(response => {
                console.info(response.data);
                if (response.data.isSuccess) {
                    window.scrollTo(0, 0);

                    setTimeout(() => {
                        handleDiscussionPosts(response.data.data.details);                        
                    }, 1000);
                } else {
                    console.error('get discussions ', response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.error('err discussions ', err.response.data.errors);
                }
            })
        }

        return () => {
            loading = false;
        }
    }, [offset]);

    return (
        <DiscussionsWrapper>
        {
            context.isPostDiscussionVisible && 
            <PostDiscussion 
            isAuth={context.isAuth} 
            handleForceRender={handleForceRender}
            css={{ marginTop: '$space-3', marginBottom: '$space-3', }} />
        }
            <DiscussionPosts 
            ref={ref}
            onClick={onClick}
            pageCount={pageCount}
            offset={offset}
            discussionsLen={discussionsLen}
            discussionPosts={discussionPosts}/>
        </DiscussionsWrapper>
    )
}

async function getDiscussions(category) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "discussion-posts", {
        params: {
            category: category
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function getPaginatedDiscussions(category, offset) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "discussion-posts/paginate", {
        params: {
            category: category,
            offset: offset,
            limit: 10,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default Discussions;