import { 
    useState, 
    useEffect,
    forwardRef,
} from 'react';
import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import DiscussionPostCard from "../DiscussionPostCard";
import Text from '../../core/Text';

const DiscussionPostsWrapper = styled('div', {
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

export const DiscussionPosts = forwardRef(({ 
    discussionPosts, 
    onClick, 
    offset,
    discussionsLen,
    pageCount,
}, ref) => {
    return (
        <DiscussionPostsWrapper ref={ref}>
        {
            (discussionPosts && (Object.keys(discussionPosts).length > 0)) && 
            Object.keys(discussionPosts).map((_, val) => 
                <DiscussionPostCard key={Object.values(discussionPosts)[val].slug} values={Object.values(discussionPosts)[val]} />
            )
        }
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
                    Showing {(offset + 1)} - {(((offset + 10) - 1) < discussionsLen) ? (offset + 10) :
                    (((offset + 10) >= discussionsLen) && discussionsLen)} of {discussionsLen + ((discussionsLen > 1) ? ' topics' : ' topic')}
                </Text>
            </PaginatorWrapper>
        </DiscussionPostsWrapper>
    )
})

export default DiscussionPosts;