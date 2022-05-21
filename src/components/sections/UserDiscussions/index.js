import { styled } from "../../../stitches.config";

const UserDiscussionsWrapper = styled('div', {});

export const UserDiscussions = () => {

    const getUserDiscussions = () => {
        console.info('user info');
    }

    return (
        <UserDiscussionsWrapper>
            User Discussuiosn
        </UserDiscussionsWrapper>
    )
}

export default UserDiscussions;