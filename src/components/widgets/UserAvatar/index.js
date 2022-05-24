import { styled } from "../../../stitches.config";

import Image from "../../core/Image";
import Text from "../../core/Text";

const UserAvatarWrapper = styled('div', {
    width: '150px',
});

export const UserAvatar = ({ values, }) => {
    return (
        <UserAvatarWrapper className="d-flex flex-column align-items-center">
            <Image src="/avatar_medium.png" css={{ width: '60px', height: '60px', objectFit: 'cover', }} />
            <Text type="span" color="darkGray">@{(values && values.username) && (values.username.length > 10 ? (values.username.slice(0, 10) + '...') : values.username)}</Text>
        </UserAvatarWrapper>
    )
}

export default UserAvatar;