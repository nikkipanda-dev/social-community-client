import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Heading from '../../core/Heading';
import UpcomingEvent from '../UpcomingEvent';

const UpcomingEventsWrapper = styled('div', {});

const UpcomingEventsGroup = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

export const UpcomingEvents = () => {
    const events = [
        {
            id: 1,
            name: "Monthly Virtual Campfire",
            start_date: "Jan 1, 2022, 00:00",
            end_date: "Jan 5, 2022, 00:00",
        },
        {
            id: 2,
            name: "Welcome to <Camp Name>",
            start_date: "Jan 1, 2022, 00:00",
            end_date: "Jan 5, 2022, 00:00",
        },
    ]

    return (
        <UpcomingEventsWrapper>
            <Heading type={6} text={<><FontAwesomeIcon icon={faCalendarDay} className="me-3" />Upcoming Events</>} />
            <UpcomingEventsGroup>
            {
                (events && (Object.keys(events).length > 0)) &&
                Object.keys(events).map((_, val) => {
                    return <UpcomingEvent key={Object.values(events)[val].id} event={Object.keys(events)[val]} />
                })
            }
            </UpcomingEventsGroup>
        </UpcomingEventsWrapper>
    )
}

export default UpcomingEvents;