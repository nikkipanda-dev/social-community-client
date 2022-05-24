import { styled } from "../../../stitches.config";

import UserAvatar from '../UserAvatar';

const UserAvatarsWrapper = styled('div', {});

export const UserAvatars = ({ 
    users, 
    className, 
    css,
}) => {
    return (
        <UserAvatarsWrapper className={"d-flex flex-wrap" + (className ? (' ' + className) : '')} {...css && {css: {...css}}}>
        {
            (users && (Object.keys(users).length > 0)) && 
            Object.keys(users).map((_, val) => <UserAvatar key={Object.values(users)[val].username} values={Object.values(users)[val]} />)
        }
        </UserAvatarsWrapper>
    )
}

export default UserAvatars;