import { useState, useEffect, useRef, } from "react";
import { useParams, } from "react-router-dom";
import { isAuth } from "../../../util";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { styled } from "../../../stitches.config";

import PostMicroblog from "../../widgets/PostMicroblog";
import MicroblogEntries from "../../widgets/MicroblogEntries";
import MicroblogStat from "../../widgets/MicroblogStat";

const MicroblogWrapper = styled('div', {
    width: '100%',
});

const MicroblogContentWrapper = styled('div', {
    padding: '0px $space-5',
});

const MicroblogStatWrapper = styled('div', {
    width: '100%',
    maxWidth: '400px',
    padding: '0px 0px 0px $space-3',
});

export const Microblog = () => {
    const params = useParams();
    const entriesRef = useRef();

    const [isPostMicroblogVisible, setIsPostMicroblogVisible] = useState(false);
    const [microblogEntries, setMicroblogEntries] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(null);

    const handleShowPostMicroblog = () => setIsPostMicroblogVisible(true);
    const handleHidePostMicroblog = () => setIsPostMicroblogVisible(false);
    const handleMicroblogEntries = microblogEntries => setMicroblogEntries(microblogEntries);
    const handlePageCount = pageCount => setPageCount(pageCount);
    const handleOffset = offset => setOffset(offset);

    const getMicroblogEntries = () => {
        if (isAuth()) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "microblog-entries/user", {
                params: {
                    username: params.username,
                    auth_username: JSON.parse(Cookies.get('auth_user')).username,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleMicroblogEntries(response.data.data.details.slice(0, 10));
                    (response.data.data.details.length > 10) ? handlePageCount(Math.ceil(response.data.data.details.length / 10)) : handlePageCount(1);
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

    const paginateMicroblogEntries = () => {
        if (isAuth() && Number.isInteger(offset)) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "microblog-entries/user/paginate", {
                params: {
                    username: params.username,
                    auth_username: JSON.parse(Cookies.get('auth_user')).username,
                    offset: offset,
                    limit: 10,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    window.scrollTo(0, ((entriesRef.current.getBoundingClientRect().top + window.scrollY)) - 100);

                    setTimeout(() => {
                        handleMicroblogEntries(response.data.data.details);                        
                    }, 500);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                console.log('err paginate', err.response ? err.response.data.errors : err);
            });
        } else {
            console.log('on microblog entries paginate: no cookies or offset is NaN');
        }
    }

    const handlePageClick = evt => {
        console.log('evt ', (((evt + 1) * 10) - 10));
        (!(evt < 0) && (evt < pageCount)) && handleOffset((((evt + 1) * 10) - 10));
    };

    useEffect(() => {
        let loading = true;

        if (loading && isAuth()) {
            (JSON.parse(Cookies.get('auth_user')).username === params.username) ? handleShowPostMicroblog() : handleHidePostMicroblog();

            getMicroblogEntries();
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;

        if (loading && Number.isInteger(offset)) {
            paginateMicroblogEntries();
        }

        return () => {
            loading = false;
        }
    }, [offset]);

    return (
        <MicroblogWrapper className="bg-primary d-flex p-1">
            <MicroblogContentWrapper className="bg-secondary flex-grow-1" ref={entriesRef}>
            {
                isPostMicroblogVisible && 
                <PostMicroblog handleMicroblogEntries={handleMicroblogEntries} />
            }
                <MicroblogEntries 
                microblogEntries={microblogEntries}
                handleMicroblogEntries={handleMicroblogEntries}
                pageCount={pageCount}
                handlePageClick={handlePageClick} />
            </MicroblogContentWrapper>
            <MicroblogStatWrapper className="bg-success">
                <MicroblogStat />
            </MicroblogStatWrapper>
        </MicroblogWrapper>
    )
}

export default Microblog;
