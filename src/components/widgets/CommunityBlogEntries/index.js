import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import CommunityBlogCard from "../CommunityBlogEntryCard";
import Text from '../../core/Text';

const CommunityBlogEntriesWrapper = styled('div', {});

const CommunityBlogGroupWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
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

export const CommunityBlogEntries = ({ 
    isEntry,
    entries,
    onClick,
    offset,
    pageCount,
    entriesLen,
}) => {
    console.log(entries);

    return (
        <CommunityBlogEntriesWrapper>
            <CommunityBlogGroupWrapper>
            {
                (entries && (Object.keys(entries).length > 0)) &&
                Object.keys(entries).map((_, val) => <CommunityBlogCard key={Object.values(entries)[val].slug} values={Object.values(entries)[val]} />)
            }
            </CommunityBlogGroupWrapper>
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
                    Showing {(offset + 1)} - {(((offset + 10) - 1) < entriesLen) ? (offset + 10) :
                    (((offset + 10) >= entriesLen) && entriesLen)} of {entriesLen + ((entriesLen > 1) ? (isEntry ? " entries" : " topics") : (isEntry ? "entry" : " topic"))}
                </Text>
            </PaginatorWrapper>
        </CommunityBlogEntriesWrapper>
    )
}

export default CommunityBlogEntries;