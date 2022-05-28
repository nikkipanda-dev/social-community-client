import { useState, useEffect, } from "react";
import { useParams, } from "react-router-dom";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBan, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Heading from "../../core/Heading";
import Text from "../../core/Text";
import UserAvatars from "../UserAvatars";
import Button from "../../core/Button";

const EventParticipantsWrapper = styled('div', {});

const ParticipantsHeaderWrapper = styled('div', {});

export const EventParticipants = ({ isAuth, }) => {
    const params = useParams();

    const [isParticipant, setIsParticipant] = useState(false);
    const [participants, setParticipants] = useState('');

    const handleIsParticipant = isParticipant => setIsParticipant(isParticipant);
    const handleParticipants = participants => setParticipants(participants);

    const handleParticipate = slug => {
        if (!(isAuth)) {
            console.log('on event supporters: no cookies');
            return;
        }

        participate(slug).then(response => {
            if (response.data.isSuccess) {
                handleIsParticipant(true);
            }
        })

        .catch(err => {
            console.error('err ', err.response.data.errors);
        });
    }

    const handleUndoParticipate = slug => {
        if (!(isAuth)) {
            console.log('on event supporters: no cookies');
            return;
        }

        undoParticipate(slug).then(response => {
            if (response.data.isSuccess) {
                handleIsParticipant(false);
            }
        })

        .catch(err => {
            console.error('err ', err.response.data.errors);
        });
    }

    useEffect(() => {
        let loading = true;

        if (!(isAuth)) {
            console.log('on event participants: no cookies');
            return;
        }

        if (loading && isAuth && params.slug) {
            getParticipants(params.slug)

            .then(response => {
                if (response.data.isSuccess) {
                    handleParticipants(response.data.data.details.supporters);
                    handleIsParticipant(response.data.data.details.is_supporter);
                } else {
                    handleParticipants('');
                }
            })

            .catch(err => {
                console.error('err get supporters ', err.response.data.errors);
            });
        }

        return () => {
            loading = false;
        }
    }, [isParticipant]);

    return (
        <EventParticipantsWrapper>
            <ParticipantsHeaderWrapper className="d-flex flex-wrap justify-content-between align-items-center">
                <Heading type={6} text="Participants" />
                {
                    (params.slug) &&
                    <Button
                        type="button"
                        text={
                            (isParticipant) ? (<Text type="span"><FontAwesomeIcon icon={faBan} className="fa-fw fa-xl me-2" />Undo participate</Text>) : <Text type="span"><FontAwesomeIcon icon={faUsers} className="fa-fw fa-xl me-2" />Participate</Text>
                        }
                        color="brown"
                        onClick={() => (isParticipant) ? handleUndoParticipate(params.slug) : handleParticipate(params.slug)} />
                }
            </ParticipantsHeaderWrapper>
            <UserAvatars users={participants} css={{ marginTop: '$space-5', }} />
        </EventParticipantsWrapper>
    )
}

async function getParticipants(slug) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "events/participants/get", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
            slug: slug,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function participate(slug) {
    const supportForm = new FormData();
    supportForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
    supportForm.append('slug', slug);

    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "events/participants/store", supportForm, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

function undoParticipate(slug) {
    const supportForm = new FormData();
    supportForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
    supportForm.append('slug', slug);

    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "events/participants/destroy", supportForm, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default EventParticipants;