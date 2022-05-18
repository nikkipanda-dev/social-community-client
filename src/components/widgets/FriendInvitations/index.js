import { useOutletContext, } from "react-router-dom";
import { useState, useEffect, useRef, } from 'react';
import Cookies from 'js-cookie';
import { axiosInstance } from '../../../requests';
import { isAuth } from "../../../util";
import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import Row from "../../core/Row";
import FriendInvitation from "../FriendInvitation";
import Text from "../../core/Text";

const FriendInvitationsWrapper = styled('div', {
    '> div': {
        width: '100%',
    },
    '> div > div > div': {
        marginRight: '$space-2',
        marginBottom: '$space-2',
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

export const FriendInvitations = () => {
    const ref = useRef('');
    const context = useOutletContext();

    const [invitations, setInvitations] = useState('');
    const [invitationsLen, setInvitationsLen] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(null);

    const handleInvitations = invitations => setInvitations(invitations);
    const handleInvitationsLen = invitationsLen => setInvitationsLen(invitationsLen);
    const handlePageCount = pageCount => setPageCount(pageCount);
    const handleOffset = offset => setOffset(offset);

    const handlePageClick = evt => {
        (!(evt < 0) && (evt < pageCount)) && handleOffset((((evt + 1) * 5) - 5));
    };

    const onClick = evt => {
        handlePageClick(evt.selected)
    };

    const getInvitations = () => {
        if (isAuth()) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "friends/user/invitations", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleInvitationsLen(Object.keys(response.data.data.details).length);
                    handleInvitations(response.data.data.details.slice(0, 5));
                    (Object.keys(response.data.data.details).length > 5) ? handlePageCount(Math.ceil(Object.keys(response.data.data.details).length / 5)) : handlePageCount(1);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err friends', err.response.data.errors);
                }
            });
        } else {
            console.log('on friends invitations section: no cookies');
        }
    }

    const paginateInvitations = () => {
        if (context.isFriendsInvitationShown && Number.isInteger(offset)) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "friends/user/invitations/paginate", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                    offset: offset,
                    limit: 5,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    if (ref.current) {
                        window.scrollTo(0, ((ref.current.getBoundingClientRect().top + window.scrollY)) - 100);
                    }

                    setTimeout(() => {
                        handleInvitations(response.data.data.details);
                    }, 500);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                console.log('err friend invitations paginate', err.response ? err.response.data.errors : err);
            });
        } else {
            console.log('on friend invitations entries paginate: no cookies or offset is NaN');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading) {
            getInvitations();
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;

        if (loading && Number.isInteger(offset)) {
            paginateInvitations();
        }

        return () => {
            loading = false;
        }
    }, [offset]);

    return (
        (context.isFriendsInvitationShown) && 
        <FriendInvitationsWrapper ref={ref}>
            <Row className="g-0 m-0 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
            {
                (invitations && (Object.keys(invitations).length > 0)) &&
                Object.keys(invitations).map((i, val) => {
                    return <FriendInvitation key={i} invitation={Object.values(invitations)[val]} />
                })
            }
            </Row>
            {
                (Number.isInteger(pageCount) && (pageCount !== 0)) && 
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
                    pageCount={pageCount}
                    renderOnZeroPageCount={null} />
                    <Text
                    type="span"
                    color="darkGray">Showing {(offset + 1)} - {(((offset + 5) - 1) < invitationsLen) ? (offset + 5) :
                    (((offset + 5) >= invitationsLen) && invitationsLen)} of {invitationsLen + ((invitationsLen > 1) ? ' invitations' : ' invitation')}</Text>
                </PaginatorWrapper>
            }
        </FriendInvitationsWrapper>
    )
}

export default FriendInvitations;