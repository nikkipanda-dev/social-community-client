import { useEffect, useState, } from "react";
import { Outlet, useParams, } from "react-router-dom";
import { isAuth } from "../../../util";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import ProfileHeader from "../../widgets/ProfileHeader";
import ProfileSidebar from '../../widgets/ProfileSidebar';

const ProfileWrapper = styled('div', {
    maxWidth: '1700px',
    paddingTop: '$space-5',
});

const ProfileContentWrapper = styled('div', {
    marginTop: '$space-4',
});

export const Profile = ({ forceRender, handleForceRender, }) => {
    const params = useParams();

    const [isContentShown, setIsContentShown] = useState('');
    const [member, setMember] = useState('');
    const [isActionShown, setIsActionShown] = useState(false);

    const handleShowContent = () => setIsContentShown(true);
    const handleHideContent = () => setIsContentShown(false);
    const handleMember = member => setMember(member);
    const handleShowAction = () => setIsActionShown(true);
    const handleHideAction = () => setIsActionShown(false);

    const getMember = () => {
        if (isAuth()) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "user", {
                params: {
                    username: params.username,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    window.scrollTo(0, 0);

                    setTimeout(() => {
                        handleMember(response.data.data.details);
                    }, 500);
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                console.log('err paginate', err.response ? err.response.data.errors : err);
            });
        } else {
            console.log('on profile: no cookies');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading && isAuth() && (member && member.username)) {
            (JSON.parse(Cookies.get('auth_user')).username === member.username) ? handleHideAction() : handleShowAction();
        }

        return () => {
            loading = false;
        }
    }, [member]);

    useEffect(() => {
        let loading = true;

        if (loading) {
            getMember();
        }

        return () => {
            loading = false;
        }
    }, [forceRender, isContentShown]); 

    return (
        <Section>
            <ProfileWrapper className="mx-auto">
                <Row className="m-0 g-0" css={{ padding: '$space-3', }}>
                    <Column className="col-12">
                        <ProfileHeader 
                        handleShowContent={handleShowContent}
                        handleHideContent={handleHideContent}
                        forceRender={forceRender} 
                        member={member}
                        isActionShown={isActionShown} />
                    </Column>
                    <Column className="col-12">
                        <ProfileContentWrapper className="d-flex">
                            <ProfileSidebar className="flex-shrink-0"/>
                            <Outlet context={{
                                isContentShown: isContentShown,
                                handleForceRender: handleForceRender,
                                forceRender: forceRender,
                            }}/>
                        </ProfileContentWrapper>
                    </Column>
                </Row>
            </ProfileWrapper>
        </Section>
    )
}

export default Profile;