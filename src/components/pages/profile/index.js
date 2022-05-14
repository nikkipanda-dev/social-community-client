import { Outlet, Link, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import ProfileHeader from "../../widgets/ProfileHeader";
import ProfileSidebar from '../../widgets/ProfileSidebar';

const ProfileWrapper = styled('div', {
    maxWidth: '1700px',
});

const ProfileContentWrapper = styled('div', {
    marginTop: '$space-4',
});

export const Profile = () => {
    return (
        <Section>
            <ProfileWrapper className="mx-auto" css={{ paddingTop: '$space-5', }}>
                <Row className="m-0 g-0 bg-warning" css={{ padding: '$space-3', }}>
                    <Column className="col-12">
                        <ProfileHeader />
                    </Column>
                    <Column className="col-12">
                        <ProfileContentWrapper className="d-flex bg-danger">
                            <ProfileSidebar className="flex-shrink-0"/>
                            <Outlet />
                        </ProfileContentWrapper>
                    </Column>
                </Row>
            </ProfileWrapper>
        </Section>
    )
}

export default Profile;