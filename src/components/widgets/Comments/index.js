import { useState, useEffect, } from "react";
import Cookies from 'js-cookie';
import { isAuth } from "../../../util";
import { axiosInstance } from "../../../requests";
import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import Comment from '../Comment';

const CommentsWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
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

export const Comments = ({ 
    entrySlug,
    forceRender,
    className, 
    handlePaginateComment,
    css,
}) => {
    const [comments, setComments] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(null);

    const handleComments = comments => setComments(comments);
    const handleOffset = offset => setOffset(offset);
    const handlePageCount = pageCount => setPageCount(pageCount);

    const onClick = evt => {
        handlePageClick(evt.selected)
    };

    const handlePageClick = evt => {
        (!(evt < 0) && (evt < pageCount)) && handleOffset((((evt + 1) * 5) - 5));
    };

    const getMicroblogEntryComments = () => {
        if (isAuth() && entrySlug) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "microblog-entries/user/entry/comments", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                    slug: entrySlug,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleComments(response.data.data.details.slice(0, 5));
                    (response.data.data.details.length > 5) ? handlePageCount(Math.ceil(response.data.data.details.length / 5)) : handlePageCount(1);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response.data.errors : err);
            });
        } else {
            console.log('on microblog entries: no cookies');
        }
    }

    const getPaginatedMicroblogEntryComments = () => {
        if (isAuth() && entrySlug) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "microblog-entries/user/entry/comments/paginate", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                    slug: entrySlug,
                    offset: offset,
                    limit: 5,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handlePaginateComment();

                    setTimeout(() => {
                        handleComments(response.data.data.details);
                    }, 500);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response.data.errors : err);
            });
        } else {
            console.log('on microblog comments: no cookies');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading) {
            getMicroblogEntryComments();
        }

        return () => {
            loading = false;
        }
    }, [forceRender]);

    useEffect(() => {
        let loading = true;

        if (loading && Number.isInteger(offset)) {
            getPaginatedMicroblogEntryComments();
        }

        return () => {
            loading = false;
        }
    }, [offset]);

    return (
        <CommentsWrapper className={' ' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
        {
            (comments && (Object.keys(comments).length > 0)) &&
            Object.keys(comments).map((i, val) => {
                return <Comment 
                omitComments 
                key={Object.values(comments)[val].slug} 
                comment={Object.values(comments)[val]} />
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
        </CommentsWrapper>
    )
}

export default Comments;