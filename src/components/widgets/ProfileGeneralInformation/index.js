import { styled } from "../../../stitches.config";

import Card from "../../core/Card";

const ProfileGeneralInfoWrapper = styled('div', {});

export const ProfileGeneralInformation = () => {
    return (
        <ProfileGeneralInfoWrapper>
            <Card css={{ padding: '$space-3', borderRadius: '$default', }}>
                General info
            </Card>
        </ProfileGeneralInfoWrapper>
    )
}

export default ProfileGeneralInformation;