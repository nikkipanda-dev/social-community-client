import { Link, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import Text from "../../core/Text";

const DiscussionPostCardWrapper = styled('div', {});

const DiscussionPostBodyWrapper = styled('div', {
    'a': {
        textDecoration: 'unset',
        color: '$sealBrown',
    },
    'a:hover': {
        color: '$pineGreen',
    },
});

const DiscussionPostContentWrapper = styled('div', {
    marginTop: '$space-2',
    background: '$white',
    padding: '$space-2',
    borderRadius: '$small',
});

export const DiscussionPostCard = ({ values }) => {
    return (
        <DiscussionPostCardWrapper>
            <Card css={{ borderRadius: '$default', padding: '$space-3', }}>
                <DiscussionPostBodyWrapper>
                    <Link to={"post/" + values.slug}>
                        <Text type="span" size="large">{values.title}</Text>
                    </Link>
                    <DiscussionPostContentWrapper>
                        {values.body}
                    </DiscussionPostContentWrapper>
                </DiscussionPostBodyWrapper>
            </Card>
        </DiscussionPostCardWrapper>
    )
}

export default DiscussionPostCard;