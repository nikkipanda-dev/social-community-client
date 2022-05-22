import { useParams, useOutletContext, } from "react-router-dom";
import { styled } from "../../../stitches.config";

const DiscussionPostWrapper = styled('div', {});

export const DiscussionPost = () => {
    const params = useParams();

    console.info(params);

    return (
        <DiscussionPostWrapper>
            Discussion post
        </DiscussionPostWrapper>
    )
}

export default DiscussionPost;