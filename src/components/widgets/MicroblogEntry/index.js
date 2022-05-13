import { useState, useEffect, } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faHeart, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import User from "../User";
import Text from "../../core/Text";
import Button from "../../core/Button";
import PostComment from '../PostComment';
import Comments from '../Comments';

const MicroblogEntryWrapper = styled('div', {});

const MicroblogHeaderWrapper = styled('div', {});

const MicroblogContentWrapper = styled('div', {
    padding: '$space-3 $space-3 1px $space-3',
    background: '$white',
    borderRadius: '$small',
    marginTop: '$space-3',
});

const MicroblogActionWrapper = styled('div', {
    marginTop: '$space-3',
});

const MicroblogStatWrapper = styled('div', {
    'span.toggle-comment:hover': {
        cursor: 'pointer',
    },
});

const MicroblogPostCommentWrapper = styled('div', {
    background: '$white',
    borderRadius: '$small',
    marginTop: '$space-3',
});

export const MicroblogEntry = ({ microblogEntry }) => {
    const [isPostCommentVisible, setIsPostCommentVisible] = useState(false);
    const [isCommentsGroupVisible, setIsCommentsGroupVisible] = useState(false);

    const handleTogglePostComment = () => setIsPostCommentVisible(!isPostCommentVisible);
    const handleToggleCommentsGroup = () => setIsCommentsGroupVisible(!isCommentsGroupVisible);

    return (
        <MicroblogEntryWrapper>
            <Card header={
                <MicroblogHeaderWrapper className="d-flex justify-content-between">
                    <User type="item" member={(microblogEntry && microblogEntry.user) && microblogEntry.user} />
                    <Text 
                    type="span" 
                    color="darkGray" 
                    css={{ margin: '$space-2', }}>
                        Jan 1, 2022, 00:00
                    </Text>
                </MicroblogHeaderWrapper>
            }
            css={{ borderRadius: '$default', padding: '$space-2', }}>
                <MicroblogContentWrapper>
                    <Text type="paragraph">{(microblogEntry && microblogEntry.body) && microblogEntry.body}</Text>
                </MicroblogContentWrapper>
                <MicroblogActionWrapper className="d-flex justify-content-between align-items-center">
                    <Button 
                    type="button" 
                    css={{ fontWeight: 'normal', }}
                    text={isPostCommentVisible ? "Cancel" : "Comment"} 
                    onClick={() => handleTogglePostComment()}
                    color="white" />
                    <MicroblogStatWrapper className="d-flex flex-wrap">
                        <Text type="span" color="darkGray">
                            5
                            <FontAwesomeIcon 
                            icon={faHeart} 
                            className="ms-1" />
                        </Text>
                        <Text 
                        type="span" 
                        color="darkGray" 
                        className="ms-2 toggle-comment" 
                        onClick={() => handleToggleCommentsGroup()}>
                            0
                            <FontAwesomeIcon icon={faComments} className="ms-1"/>
                        </Text>
                    </MicroblogStatWrapper>
                </MicroblogActionWrapper>
                <MicroblogPostCommentWrapper>
                {
                    isPostCommentVisible && 
                    <PostComment />
                }
                {
                    isCommentsGroupVisible && 
                    <Comments css={{ marginTop: '30px', }} />
                }
                </MicroblogPostCommentWrapper>
            </Card>
        </MicroblogEntryWrapper>
    )
}
export default MicroblogEntry;
