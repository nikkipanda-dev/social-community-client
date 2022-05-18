import { useState, useEffect, } from "react";
import { useParams, } from "react-router-dom";
import { isAuth } from "../../../util";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { styled } from "../../../stitches.config";

const FriendsWrapper = styled('div', {});

export const Friends = ({ className, css, }) => {
    const params = useParams();

    const getFriends = () => {
        if (isAuth()) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "friends/user/all", {
                params: {
                    username: params.username,
                    auth_username: JSON.parse(Cookies.get('auth_user')).username,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                console.log('res ', response.data);
                // if (response.data.isSuccess) {
                //     handleMicroblogEntriesLen(Object.keys(response.data.data.details).length);
                //     handleMicroblogEntries(response.data.data.details.slice(0, 10));
                //     (Object.keys(response.data.data.details).length > 10) ? handlePageCount(Math.ceil(Object.keys(response.data.data.details).length / 10)) : handlePageCount(1);
                // } else {
                //     console.log(response.data.data.errorText);
                // }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err friends', err.response.data.errors);
                }
            });
        } else {
            console.log('on friends section: no cookies');
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

    return (
        <FriendsWrapper>
            Friends section
        </FriendsWrapper>
    )
}

export default Friends;