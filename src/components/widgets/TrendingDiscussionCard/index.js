import { Link, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faComments } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import Text from "../../core/Text";

const TrendingDiscussionWrapper = styled('div', {
    'a': {
        textDecoration: 'unset',
        color: '$pineGreen',
    },
    'a:hover': {
        color: '$darkGray',
    },
});

const TrendingDiscussionDetailsWrapper = styled('div', {});

export const TrendingDiscussionCard = ({ discussion }) => {
    return (
        <TrendingDiscussionWrapper>
            <Card 
            header={<Link to="/discussion"><Text type="span" size="medium">{discussion && discussion.title}</Text></Link>} 
            // size="medium" 
            css={{ padding: '$space-2', borderRadius: '$default', }}>
                <TrendingDiscussionDetailsWrapper className="d-flex flex-wrap">
                    <Text type="span" color="darkGray" className="mt-2">
                        {(discussion && discussion.supporters) && discussion.supporters} <FontAwesomeIcon icon={faHandHoldingHeart} /> 
                    </Text>
                    <Text type="span" color="darkGray" className="mt-2 ms-2">
                        {(discussion && discussion.replies) && discussion.replies} <FontAwesomeIcon icon={faComments} />
                    </Text>
                </TrendingDiscussionDetailsWrapper>
            </Card>
        </TrendingDiscussionWrapper>
    )
}

export default TrendingDiscussionCard;