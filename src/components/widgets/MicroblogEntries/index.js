import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import MicroblogEntry from "../MicroblogEntry";

const MicroblogEntriesWrapper = styled('div', {
    marginTop: '$space-5',
    '> div:nth-child(n+2)': {
        marginTop: '$space-5',
    },
});

const PaginatorWrapper = styled('div', {
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
        padding: '$space-3',
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

export const MicroblogEntries = ({ 
    microblogEntries, 
    handleMicroblogEntries,
    pageCount,
    handlePageClick,
}) => {
    const onClick = evt => {
        handlePageClick(evt.selected)
    };

    return (
        <MicroblogEntriesWrapper>
        {
            (microblogEntries && (Object.keys(microblogEntries).length > 0)) && 
            Object.keys(microblogEntries).map((i, val) => {
                return <MicroblogEntry 
                key={Object.values(microblogEntries)[val].slug}
                microblogEntry={Object.values(microblogEntries)[val]} />
            })
        }
            <PaginatorWrapper>
            {
                (pageCount && Number.isInteger(pageCount)) && 
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
                pageRangeDisplayed={10}
                pageCount={pageCount}
                renderOnZeroPageCount={null} />
            }
            </PaginatorWrapper>
        </MicroblogEntriesWrapper>
    )
}

export default MicroblogEntries;