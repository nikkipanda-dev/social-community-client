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

export const TrendingDiscussionCard = ({ values, }) => {
    return (
        <TrendingDiscussionWrapper>
            <Card 
            header={<Link to={"/discussions/post/" + (values && values.slug)}><Text type="span" size="medium">{values && values.title}</Text></Link>} 
            css={{ 
                padding: '$space-2', 
                borderRadius: '$default', 
                background: 'transparent', 
            }}>
                <TrendingDiscussionDetailsWrapper className="d-flex flex-wrap">
                    <Text type="span" color="darkGray" className="mt-2">
                        <FontAwesomeIcon icon={faHandHoldingHeart} className="fa-fw" /> {(values && values.supporters) && values.supporters}
                    </Text>
                    <Text type="span" color="darkGray" className="mt-2 ms-2">
                        <FontAwesomeIcon icon={faComments} className="fa-fw" /> {(values && values.replies) && values.replies}
                    </Text>
                </TrendingDiscussionDetailsWrapper>
            </Card>
        </TrendingDiscussionWrapper>
    )
}

export default TrendingDiscussionCard;