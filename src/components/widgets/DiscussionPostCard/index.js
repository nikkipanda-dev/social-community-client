import { styled } from "../../../stitches.config";

import Card from "../../core/Card";

const DiscussionPostCardWrapper = styled('div', {});

const DiscussionPostBodyWrapper = styled('div', {});

export const DiscussionPostCard = ({ values }) => {
    return (
        <DiscussionPostCardWrapper>
            <Card>
                <DiscussionPostBodyWrapper>
                    Hello
                </DiscussionPostBodyWrapper>
            </Card>
        </DiscussionPostCardWrapper>
    )
}

export default DiscussionPostCard;