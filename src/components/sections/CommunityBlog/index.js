import { 
    useState, 
    useEffect, 
} from "react";
import { useOutletContext, NavLink, } from "react-router-dom";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog, faFeatherPointed, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import CommunityBlogEntries from "../../widgets/CommunityBlogEntries";
import Text from "../../core/Text";

const CommunityBlogWrapper = styled('div', {
    '> div:nth-child(1)': {
        flex: '35%',
    },
    '> div:nth-child(2)': {
        flex: '65%',
        marginTop: '0px',
    },
    '@media screen and (max-width: 991px)': {
        marginTop: '$space-4',
    },
});

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

export const CommunityBlog = () => {
    const context = useOutletContext();

    const [entries, setEntries] = useState('');
    const [category, setCategory] = useState('');
    const [entriesLen, setEntriesLen] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(null);

    const handleEntries = entries => setEntries(entries);
    const handleCategory = category => setCategory(category);
    const handleEntriesLen = entriesLen => setEntriesLen(entriesLen);
    const handlePageCount = pageCount => setPageCount(pageCount);
    const handleOffset = offset => setOffset(offset);

    const handlePageClick = evt => {
        (!(evt < 0) && (evt < pageCount)) && handleOffset((((evt + 1) * 10) - 10));
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
            getEntries(category ? category : '').then(response => {
                if (!(response.data.isSuccess)) {
                    console.error('on get err ', response.data.data.errorText);
                    return;
                }

                handleEntries(response.data.data.details.slice(0, 10));
                handleEntriesLen(Object.keys(response.data.data.details).length);
                (Object.keys(response.data.data.details).length > 10) ? handlePageCount(Math.ceil(Object.keys(response.data.data.details).length / 10)) : handlePageCount(1);
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
            getPaginatedEntries(category ? category : '', offset, limit).then(response => {
                if (!(response.data.isSuccess)) {
                    console.error('on get err ', response.data.data.errorText);
                    return;
                }

                window.scrollTo(0, 0);

                setTimeout(() => {
                    handleEntries(response.data.data.details);                    
                }, 1000);
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
        <CommunityBlogWrapper className="d-flex flex-column">
            <ActionWrapper>
                <NavLink to="/community-blog/editor" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                    <Text type="span" size="medium"><FontAwesomeIcon className="me-2 fa-fw" icon={faFeatherPointed} />Create</Text>
                </NavLink>
                <NavLink to="/community-blog/all" className={({ isActive }) => isActive ? 'active-nav' : undefined}>
                    <Text type="span" size="medium"><FontAwesomeIcon className="me-2 fa-fw" icon={faBlog} />All</Text>
                </NavLink>
            </ActionWrapper>
            <CommunityBlogEntries 
            isEntry={true}
            entries={entries} 
            entriesLen={entriesLen}
            offset={offset} 
            pageCount={pageCount}
            onClick={onClick} />
        </CommunityBlogWrapper>
    )
}

async function getEntries(category) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "blog-entries/get", {
        params: {
            category: category,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function getPaginatedEntries(category, offset, limit) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "blog-entries/paginate", {
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

export default CommunityBlog;