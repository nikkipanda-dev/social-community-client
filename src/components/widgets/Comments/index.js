import { styled } from "../../../stitches.config";

import Comment from '../Comment';

const CommentsWrapper = styled('div', {});

export const Comments = ({ 
    comments, 
    className, 
    css,
}) => {
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