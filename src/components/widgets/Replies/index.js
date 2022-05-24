import { styled } from "../../../stitches.config"

import Reply from '../Reply';
import Text from "../../core/Text";
import Button from "../../core/Button";

const RepliesWrapper = styled('div', {});

const RepliesFooterWrapper = styled('div', {});

const ReplyGroupWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

const SubmitButtonWrapper = styled('div', {});

export const Replies = ({ 
    className,
    css,
    replies,
    handleForceRender, 
    repliesLen,
    limit,
    header,
    status,
    handleHelp,
    handleStatus,
    handleHeader,
    updateHelp,
    handleUpdateHelp,
    help,
    handleLimit,
    isAuth,
    updateReply,
    removeReply,
    onHeartReplyClick,
}) => {
    const updateLimit = () => {
        ((limit && (limit + 5)) <= repliesLen) ? handleLimit(limit + 5) : handleLimit(repliesLen);
    }

    return (
        <RepliesWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <ReplyGroupWrapper>
            {
                (replies && (Object.keys(replies).length > 0)) &&
                Object.keys(replies).map((_, val) => <Reply
                    key={Object.values(replies)[val].slug}
                    handleForceRender={handleForceRender}
                    isAuth={isAuth}
                    updateReply={updateReply}
                    removeReply={removeReply}
                    header={header}
                    status={status}
                    help={help}
                    updateHelp={updateHelp}
                    handleUpdateHelp={handleUpdateHelp}
                    handleHelp={handleHelp}
                    handleStatus={handleStatus}
                    handleHeader={handleHeader}
                    onHeartReplyClick={onHeartReplyClick}
                    values={Object.values(replies)[val]} />)
            }
            </ReplyGroupWrapper>
            <hr />
            <RepliesFooterWrapper className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                <Text type="span" color="darkGray">Showing {Object.keys(replies).length} of {repliesLen} {(repliesLen > 1) ? 'replies' : 'reply'}</Text>
                {
                    (limit < repliesLen) &&
                    <SubmitButtonWrapper>
                        <Button
                        type="button"
                        text="Load more"
                        color="white"
                        className="flex-grow-1 flex-md-grow-0"
                        onClick={() => updateLimit()} />
                    </SubmitButtonWrapper>
                }
            </RepliesFooterWrapper>
        </RepliesWrapper>
    )
}

export default Replies;