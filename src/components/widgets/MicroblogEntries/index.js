import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import MicroblogEntry from "../MicroblogEntry";

const MicroblogEntriesWrapper = styled('div', {
    marginTop: '$space-5',
    '> div:nth-child(n+2)': {
        marginTop: '$space-5',
    },
});

export const MicroblogEntries = ({ 
    microblogEntries, 
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
                return <MicroblogEntry key={Object.values(microblogEntries)[val].id} microblogEntry={Object.values(microblogEntries)[val]} />
            })
        }
        <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={onClick}
        pageRangeDisplayed={10}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null} />
        </MicroblogEntriesWrapper>
    )
}

export default MicroblogEntries;