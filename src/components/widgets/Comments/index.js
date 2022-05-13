import { styled } from "../../../stitches.config";

import Comment from '../Comment';

const CommentsWrapper = styled('div', {});

export const Comments = ({ className, css, }) => {
    return (
        <CommentsWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <Comment omitComments/>
        </CommentsWrapper>
    )
}

export default Comments;