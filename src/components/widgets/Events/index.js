import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import EventCard from '../EventCard';
import Text from '../../core/Text';

const EventsWrapper = styled('div', {});

const EventGroupWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

const PaginatorWrapper = styled('div', {
    marginTop: '$space-3',
    '.paginator': {
        width: '100%',
        background: '$lightGray',
        listStyleType: 'none',
        borderRadius: '$default',
    },
    '.paginator > .paginator-item:nth-child(n+2)': {
        marginLeft: '$space-1',
    },
    '.paginator-item': {
        fontFamily: '$manjari',
        padding: '$space-2 $space-2 $space-1'
    },
    '.prev-link-item, .next-link-item': {
        fontSize: '40px',
        textDecoration: 'none',
        color: '$sealBrown',
    },
    '.paginator-link-item': {
        fontSize: '$medium',
        textDecoration: 'none',
        color: '$darkGray',
    },
    '.paginator-active-item': {
        background: '$white',
        borderRadius: '$small',
    },
    '.paginator-link-active-item': {
        color: '$black',
    },
});

export const Events = ({ 
    events,
    eventsLen,
    onClick,
    offset,
    pageCount,
}) => {
    return (
        <EventsWrapper>
            <EventGroupWrapper>
            {
                (events && (Object.keys(events).length > 0)) &&
                Object.keys(events).map((i, val) => <EventCard key={Object.values(events)[val].slug} values={Object.values(events)[val]} />)
            }
            </EventGroupWrapper>
            <PaginatorWrapper>
                <ReactPaginate
                breakLabel="..."
                previousLabel="&#x2039;"
                nextLabel="&#x203A;"
                onPageChange={onClick}
                className="paginator d-flex justify-content-center align-items-center"
                previousClassName="paginator-item"
                nextClassName="paginator-item"
                pageClassName="paginator-item"
                activeClassName="paginator-active-item"
                activeLinkClassName="paginator-link-active-item"
                pageLinkClassName="paginator-link-item"
                previousLinkClassName="prev-link-item"
                nextLinkClassName="next-link-item"
                pageRangeDisplayed={5}
                marginPagesDisplayed={3}
                pageCount={pageCount}
                renderOnZeroPageCount={null} />
                <Text
                type="span"
                color="darkGray">
                    Showing {(offset + 1)} - {(((offset + 5) - 1) < eventsLen) ? (offset + 5) :
                    (((offset + 5) >= eventsLen) && eventsLen)} of {eventsLen + ((eventsLen > 1) ? " events" :  " event")}
                </Text>
            </PaginatorWrapper>
        </EventsWrapper>
    )
}

export default Events;