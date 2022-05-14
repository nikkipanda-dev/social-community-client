import { useState, useEffect, } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faHeart, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Card from '../../core/Card';
import Image from "../../core/Image";
import Button from "../../core/Button";
import Text from "../../core/Text";

const CommentWrapper = styled('div', {});

const AvatarWrapper = styled('div', {});

const CommentDetailsWrapper = styled('div', {
    padding: '$space-2',
    background: '$white', // remove this
    borderRadius: '$default',
});

const CommentBodyWrapper = styled('div', {
    padding: '$space-3',
    background: '$lightGray',
    borderRadius: '$small',
});

const CommentHeaderWrapper = styled('div', {});

const CommentContentWrapper = styled('div', {
    padding: '$space-3 $space-3 1px $space-3',
    background: '$white',
    borderRadius: '$small',
    marginTop: '$space-3',
});

const CommentActionWrapper = styled('div', {
    marginTop: '$space-3',
});

const CommentStatWrapper = styled('div', {});

const CommentPostCommentWrapper = styled('div', {
    background: '$white',
    borderRadius: '$small',
    marginTop: '$space-3',
});

export const Comment = ({ comment, omitComments, }) => {

    return (
        <CommentWrapper>
            <Card css={{ padding: '$space-2', }}>
                <CommentDetailsWrapper className="d-flex">
                    <AvatarWrapper className="bg-danger" style={{ maxWidth: '60px', }}>
                        <Image className="bg-primary" src="/avatar_medium.png" css={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                        }} />
                    </AvatarWrapper>
                    <CommentBodyWrapper className="flex-grow-1 d-flex flex-column ms-3">
                        <CommentHeaderWrapper className="d-flex justify-content-between">
                            <Text type="span">@username</Text>
                            <Text type="span" color="darkGray">Jan 1, 2022, 00:00</Text>
                        </CommentHeaderWrapper>
                        <CommentContentWrapper>
                            <Text type="paragraph" css={{ textAlign: 'justify', }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, ab. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate tenetur est ipsa soluta blanditiis harum numquam illo iusto ex beatae?</Text>
                        </CommentContentWrapper>
                        <CommentActionWrapper className={"d-flex" + (!(omitComments) ? " justify-content-between " : " justify-content-end ") + "align-items-center"}>
                        {
                            !(omitComments) && 
                            <Button
                            type="button"
                            text="Comment"
                            color="white" />
                        }
                            <CommentStatWrapper className="d-flex flex-wrap">
                                <Text type="span" color="darkGray">
                                    5
                                    <FontAwesomeIcon icon={faHeart} className="ms-1" />
                                </Text>
                            {
                                !(omitComments) && 
                                <Text type="span" color="darkGray" className="ms-2">
                                    0
                                    <FontAwesomeIcon icon={faComments} className="ms-1" />
                                </Text>
                            }
                            </CommentStatWrapper>
                        </CommentActionWrapper>
                    </CommentBodyWrapper>
                </CommentDetailsWrapper>
            </Card>
        </CommentWrapper>
    )
}

export default Comment;