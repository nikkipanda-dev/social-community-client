import { useState, useEffect, useRef, } from "react";
import { useParams, useOutletContext, } from "react-router-dom";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import ReactPaginate from 'react-paginate';
import { styled } from "../../../stitches.config";

import FriendCard from "../../widgets/FriendCard";
import Text from "../../core/Text";
import Row from "../../core/Row";

const FriendsWrapper = styled('div', {
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

export const Friends = ({ className, css, }) => {
    const params = useParams();
    const ref = useRef('');
    const context = useOutletContext();

    const [friends, setFriends] = useState('');
    const [friendsLen, setFriendsLen] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(null);

    const handleFriends = friends => setFriends(friends);
    const handlePageCount = pageCount => setPageCount(pageCount);
    const handleFriendsLen = friendsLen => setFriendsLen(friendsLen);
    const handleOffset = offset => setOffset(offset);

    const handlePageClick = evt => {
        (!(evt < 0) && (evt < pageCount)) && handleOffset((((evt + 1) * 16) - 16));
    };

    const onClick = evt => {
        handlePageClick(evt.selected)
    };

    const getFriends = () => {
        if (context.isAuth) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "friends/user/all", {
                params: {
                    auth_username: JSON.parse(Cookies.get('auth_user')).username,
                    username: params.username,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleFriendsLen(Object.keys(response.data.data.details).length);
                    handleFriends(response.data.data.details.slice(0, 16));
                    (Object.keys(response.data.data.details).length > 16) ? handlePageCount(Math.ceil(Object.keys(response.data.data.details).length / 16)) : handlePageCount(1);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err friends get all ', err.response.data.errors);
                }
            });
        } else {
            console.log('on friends get all section: no cookies');
        }
    }

    const paginateFriends = () => {
        if (context.isAuth && Number.isInteger(offset)) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "friends/user/paginate", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                    offset: offset,
                    limit: 16,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    if (ref.current) {
                        window.scrollTo(0, ((ref.current.getBoundingClientRect().top + window.scrollY)) - 200);
                    }

                    setTimeout(() => {
                        handleFriends(response.data.data.details);
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
            getFriends();
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;

        if (loading && Number.isInteger(offset)) {
            paginateFriends();
        }

        return () => {
            loading = false;
        }
    }, [offset]);

    return (
        <FriendsWrapper ref={ref}>
            <Row className="g-0 m-0 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
            {
                (friends && Object.keys(friends).length > 0) &&
                Object.keys(friends).map((_, val) => {
                    return <FriendCard key={Object.values(friends)[val].username} values={Object.values(friends)[val]} />
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
                pageRangeDisplayed={16}
                pageCount={pageCount}
                renderOnZeroPageCount={null} />
                <Text
                type="span"
                color="darkGray">
                    Showing {(offset + 1)} - {(((offset + 16) - 1) < friendsLen) ? (offset + 16) :
                    (((offset + 16) >= friendsLen) && friendsLen)} of {friendsLen + ((friendsLen > 1) ? ' invitations' : ' invitation')}</Text>
            </PaginatorWrapper>
        }
        </FriendsWrapper>
    )
}

export default Friends;