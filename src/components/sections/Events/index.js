import { useState, useEffect, } from 'react';
import Cookies from 'js-cookie';
import { useOutletContext, NavLink, } from 'react-router-dom';
import { axiosInstance } from "../../../requests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faFeatherPointed, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import { Events as EventsWidget } from "../../widgets/Events";
import Text from '../../core/Text';

const EventsWrapper = styled('div', {});

const ActionWrapper = styled('div', {
    background: '$lightGray',
    marginBottom: '$space-4',
    padding: '$space-1',
    'a': {
        transition: '$default',
        textDecoration: 'unset',
        marginRight: '$space-2',
        color: '$black',
        fontFamily: '$manjari',
        fontSize: '$medium',
        letterSpacing: '$default',
    },
    'a > span': {
        display: 'inline-block',
        padding: '$space-3',
        marginTop: '$space-1',
    },
    'a:hover': {
        color: '$pineGreen',
    },
    'a.active-nav': {
        color: '$pineGreen',
        background: '$white',
        padding: '$space-3 0px $space-2',
        borderRadius: '$small',
    },
});

export const Events = () => {
    const context = useOutletContext();

    const [posts, setPosts] = useState('');
    const [category, setCategory] = useState('');
    const [postsLen, setPostsLen] = useState(0);
    const [limit, setLimit] = useState(5);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(null);

    const handlePosts = posts => setPosts(posts);
    const handleCategory = category => setCategory(category);
    const handlePostsLen = postsLen => setPostsLen(postsLen);
    const handlePageCount = pageCount => setPageCount(pageCount);
    const handleOffset = offset => setOffset(offset);

    const handlePageClick = evt => {
        (!(evt < 0) && (evt < pageCount)) && handleOffset((((evt + 1) * 5) - 5));
    };

    const onClick = evt => {
        handlePageClick(evt.selected)
    };

    useEffect(() => {
        let loading = true;

        if (!(context.isAuth)) {
            console.error('on get entries: no cookies');
            return;
        }

        if (loading && context.isAuth) {
            getEvents(category ? category : '').then(response => {
                console.log(response.data);
                if (!(response.data.isSuccess)) {
                    console.error('on get err ', response.data.data.errorText);
                    return;
                }

                handlePosts(response.data.data.details.slice(0, 5));
                handlePostsLen(Object.keys(response.data.data.details).length);
                (Object.keys(response.data.data.details).length > 5) ? handlePageCount(Math.ceil(Object.keys(response.data.data.details).length / 5)) : handlePageCount(1);
            })

            .catch(err => {
                console.error('err get ', err);
            });
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;

        if (!(context.isAuth)) {
            console.error('on get entries: no cookies');
            return;
        }

        if (loading && context.isAuth && Number.isInteger(offset)) {
            getPaginatedEvents(category ? category : '', offset, limit).then(response => {
                if (!(response.data.isSuccess)) {
                    console.error('on get err ', response.data.data.errorText);
                    return;
                }

                window.scrollTo(0, 0);

                setTimeout(() => {
                    handlePosts(response.data.data.details);
                }, 500);
            })

                .catch(err => {
                    console.error('err get ', err);
                });
        }

        return () => {
            loading = false;
        }
    }, [offset]);

    return (
        <EventsWrapper>
            <ActionWrapper>
                <NavLink to="editor" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                    <Text type="span" size="medium"><FontAwesomeIcon className="me-2 fa-fw" icon={faFeatherPointed} />Create</Text>
                </NavLink>
                <NavLink to="/events" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                    <Text type="span" size="medium"><FontAwesomeIcon className="me-2 fa-fw" icon={faCalendarDay} />All</Text>
                </NavLink>
            </ActionWrapper>
            <EventsWidget 
            events={posts}
            offset={offset}
            pageCount={pageCount}
            onClick={onClick}
            eventsLen={postsLen} />
        </EventsWrapper>
    )
}

async function getEvents(category) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "events", {
        params: {
            category: category,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function getPaginatedEvents(category, offset, limit) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "events/paginate", {
        params: {
            category: category,
            offset: offset,
            limit: limit,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default Events;