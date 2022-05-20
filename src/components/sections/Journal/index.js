import { useState, useEffect, useRef, } from 'react';
import { useOutletContext, } from 'react-router-dom';
import Cookies from 'js-cookie';
import { axiosInstance } from '../../../requests';
import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import JournalEntries from '../../widgets/JournalEntries';
import Text from '../../core/Text';

const JournalWrapper = styled('div', {
    width: '100%',
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

export const Journal = () => {
    const ref = useRef('');
    const context = useOutletContext();

    const [journalEntries, setJournalEntries] = useState('');
    const [journalEntriesLen, setJournalEntriesLen] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(null);

    const handleJournalEntries = journalEntries => setJournalEntries(journalEntries);
    const handleJournalEntriesLen = len => setJournalEntriesLen(len);
    const handlePageCount = pageCount => setPageCount(pageCount);
    const handleOffset = offset => setOffset(offset);

    const handlePageClick = evt => {
        (!(evt < 0) && (evt < pageCount)) && handleOffset((((evt + 1) * 10) - 10));
    };

    const onClick = evt => {
        handlePageClick(evt.selected)
    };

    const getJournalEntries = () => {
        if (context.isAuth) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "journal-entries/user/all", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleJournalEntriesLen(Object.keys(response.data.data.details).length);
                    handleJournalEntries(response.data.data.details.slice(0, 10));
                    (Object.keys(response.data.data.details).length > 10) ? handlePageCount(Math.ceil(Object.keys(response.data.data.details).length / 10)) : handlePageCount(1);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err profile journal', err.response.data.errors);
                }
            });
        } else {
            console.log('on profile journal entries: no cookies');
        }
    }

    const paginateJournalEntries = () => {
        if (context.isAuth && Number.isInteger(offset)) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "journal-entries/user/paginate", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                    offset: offset,
                    limit: 10,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                console.log('res paginated ', response.data);
                if (response.data.isSuccess) {
                    if (ref.current) {
                        window.scrollTo(0, ((ref.current.getBoundingClientRect().top + window.scrollY)) - 200);
                    }

                    setTimeout(() => {
                        handleJournalEntries(response.data.data.details);
                    }, 500);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                console.log('err journal entries paginate', err.response ? err.response.data.errors : err);
            });
        } else {
            console.log('on journal entries paginate: no cookies or offset is NaN');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading) {
            getJournalEntries();
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;

        if (loading && Number.isInteger(offset)) {
            paginateJournalEntries();
        }

        return () => {
            loading = false;
        }
    }, [offset]);

    return (
        <JournalWrapper>
            <JournalEntries journalEntries={journalEntries} handleJournalEntries={handleJournalEntries} />
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
                pageRangeDisplayed={10}
                pageCount={pageCount}
                renderOnZeroPageCount={null} />
                <Text
                type="span"
                    color="darkGray">Showing {(offset + 1)} - {(((offset + 10) - 1) < journalEntriesLen) ? (offset + 10) :
                    (((offset + 10) >= journalEntriesLen) && journalEntriesLen)} of {journalEntriesLen + ((journalEntriesLen > 1) ? ' entries' : ' entry')}</Text>
            </PaginatorWrapper>
        </JournalWrapper>
    )
}

export default Journal;
