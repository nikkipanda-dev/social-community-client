import { styled } from "../../../stitches.config";

import Card from "../../core/Card";

const ProfileRecentActivitiesWrapper = styled('div', {});

export const ProfileRecentActivities = () => {
    return (
        <ProfileRecentActivitiesWrapper>
            <Card css={{ padding: '$space-3', borderRadius: '$default', }}>
                Recent activities
            </Card>
        </ProfileRecentActivitiesWrapper>
    )
}

export default ProfileRecentActivities;