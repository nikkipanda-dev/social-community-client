import { Link, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import Text from "../../core/Text";

const UpcomingEventWrapper = styled('div', {
    'a': {
        textDecoration: 'unset',
        color: '$pineGreen',
    },
    'a:hover': {
        color: '$darkGray',
    },
});

export const UpcomingEvent = ({ event }) => {
    return (
        <UpcomingEventWrapper>
            <Card 
            header={<Link to="/event"><Text type="span" size="medium">Monthly Virtual Campfire</Text></Link>}
            css={{ padding: '$space-2', borderRadius: '$default', }}>
                <Text type="span" color="darkGray">When: Feb 1, 2022, 00:00</Text>
            </Card>
        </UpcomingEventWrapper>
    )
}

export default UpcomingEvent;