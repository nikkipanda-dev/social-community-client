import { useState, useEffect, } from 'react';
import Cookies from 'js-cookie';
import { axiosInstance } from '../../../requests';
import { useParams, } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faBan, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import UserAvatars from "../UserAvatars";
import Button from "../../core/Button";
import Heading from "../../core/Heading";
import Text from "../../core/Text";

const SupportersWrapper = styled('div', {});

const SupportersHeaderWrapper = styled('div', {});

export const CommunityBlogEntrySupporters = ({
    isAuth,
    className,
    css,
}) => {
    const params = useParams();

    const [isSupporter, setIsSupporter] = useState(false);
    const [supporters, setSupporters] = useState('');

    const handleIsSupporter = isSupporter => setIsSupporter(isSupporter);
    const handleSupporters = supporters => setSupporters(supporters);

    const handleSupportPost = slug => {
        if (!(isAuth)) {
            console.log('on blog supporters: no cookies');
            return;
        }

        supportPost(slug).then(response => {
            if (response.data.isSuccess) {
                handleIsSupporter(true);
            }
        })

        .catch(err => {
            console.error('err ', err.response.data.errors);
        });
    }

    const handleUndoSupportPost = slug => {
        if (!(isAuth)) {
            console.log('on blog supporters: no cookies');
            return;
        }

        undoSupportPost(slug).then(response => {
            if (response.data.isSuccess) {
                handleIsSupporter(false);
            }
        })

        .catch(err => {
            console.error('err ', err.response.data.errors);
        });
    }

    useEffect(() => {
        let loading = true;

        if (!(isAuth)) {
            console.log('on blog supporters: no cookies');
            return;
        }

        if (loading && isAuth && params.slug) {
            getSupporters(params.slug)

            .then(response => {
                if (response.data.isSuccess) {
                    handleSupporters(response.data.data.details.supporters);
                    handleIsSupporter(response.data.data.details.is_supporter);
                } else {
                    handleSupporters('');
                }
            })

            .catch(err => {
                console.error('err get supporters ', err.response.data.errors);
            });
        }

        return () => {
            loading = false;
        }
    }, [isSupporter]);

    return (
        <SupportersWrapper>
            <SupportersHeaderWrapper className="d-flex flex-wrap justify-content-between align-items-center">
                <Heading type={6} text="Supporters" />
                {
                    (params.slug) &&
                    <Button
                    type="button"
                    text={
                        (isSupporter) ? (<Text type="span"><FontAwesomeIcon icon={faBan} className="fa-fw fa-xl me-2" />Undo support</Text>) : <Text type="span"><FontAwesomeIcon icon={faHandHoldingHeart} className="fa-fw fa-xl me-2" />Support</Text>
                    }
                    color="brown"
                    onClick={() => (isSupporter) ? handleUndoSupportPost(params.slug) : handleSupportPost(params.slug)} />
                }
            </SupportersHeaderWrapper>
            <UserAvatars users={supporters} css={{ marginTop: '$space-5', }} />
        </SupportersWrapper>
    )
}

async function getSupporters(slug) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "blog-entries/support/get", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
            slug: slug,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function supportPost(slug) {
    const supportForm = new FormData();
    supportForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
    supportForm.append('slug', slug);

    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "blog-entries/support/store", supportForm, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function undoSupportPost(slug) {
    const supportForm = new FormData();
    supportForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
    supportForm.append('slug', slug);

    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "blog-entries/support/destroy", supportForm, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default CommunityBlogEntrySupporters;