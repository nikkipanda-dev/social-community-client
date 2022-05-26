import Cookies from 'js-cookie';
import { useNavigate, } from 'react-router-dom';
import { axiosInstance, } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import { PostCommunityBlog as Post } from "../../widgets/PostCommunityBlog";
import Button from '../../core/Button';
import Text from '../../core/Text';

const PostCommunityBlogWrapper = styled('div', {});

const ActionWrapper = styled('div', {
    marginBottom: '$space-3',
});

export const PostCommunityBlog = () => {
    const navigate = useNavigate();

    const handleNavigator = () => {
        navigate("../");
    }

    return (
        <PostCommunityBlogWrapper>
            <ActionWrapper className="d-flex">
                <Button
                type="button"
                text={<Text type="span"><FontAwesomeIcon icon={faCaretLeft} className="fa-fw" />Go back</Text>}
                className="flex-grow-1 flex-sm-grow-0"
                onClick={() => handleNavigator()} />
            </ActionWrapper>
            <Post storeFn={storeCommunityBlog} />
        </PostCommunityBlogWrapper>
    )
}

function storeCommunityBlog(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "blog-entries/store", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default PostCommunityBlog;