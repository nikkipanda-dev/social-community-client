import { Link, } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDay,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import Card from "../../core/Card";

const EventCardWrapper = styled('div', {});

const EventCardBodyWrapper = styled('div', {
    'a': {
        textDecoration: 'unset',
        color: '$sealBrown',
    },
    'a:hover': {
        color: '$pineGreen',
    },
});

const EventCardContentWrapper = styled('div', {
    marginTop: '$space-4',
    background: '$white',
    padding: '$space-4 $space-2 $space-1',
    borderRadius: '$small',
});

export const EventCard = ({ values, }) => {
    return (
        <EventCardWrapper>
            <Card css={{ borderRadius: '$default', padding: '$space-3', }}>
                <EventCardBodyWrapper className="d-flex flex-column">
                    <Link to={"/events/post/" + (values && values.slug)}>
                        <Text type="span" size="large">{(values && values.name)}</Text>
                    </Link>
                    <Text type="span" color="darkGray"><FontAwesomeIcon icon={faCalendarDay} className="fa-fw fa-xl me-1" />
                    {
                        (values && values.created_at) &&
                        new Intl.DateTimeFormat('en-US', {
                            timeZone: 'Asia/Manila',
                            hourCycle: 'h12',
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(new Date(values.created_at))   
                    }
                    </Text>
                    <EventCardContentWrapper>
                        <Text type="paragraph">{values.details}</Text>
                    </EventCardContentWrapper>
                </EventCardBodyWrapper>
            </Card>
        </EventCardWrapper>
    )
}

export default EventCard;