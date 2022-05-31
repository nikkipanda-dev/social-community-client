import { styled } from "../../../stitches.config";

import MessagesUserCard from "../MessagesUserCard";

const MessagesUsersWrapper = styled('div', {});

const MessagesUserGroupWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        borderStyle: 'solid',
        borderWidth: '1px 0px',
        borderColor: '$lightGray1',
    },
});

export const MessagesUsers = () => {
    const users = [
        {
            id: 1,
            first_name: "Jane",
            last_name: "Doe",
            username: "janedoe",
        },
        {
            id: 2,
            first_name: "John",
            last_name: "Doe",
            username: "johndoe",
        },
    ]

    return (
        <MessagesUsersWrapper>
            <MessagesUserGroupWrapper>
            {
                (users && (Object.keys(users).length > 0)) && 
                Object.keys(users).map((i, val) => <MessagesUserCard key={Object.values(users)[val].id} values={Object.values(users)[val]} />)
            }
            </MessagesUserGroupWrapper>
        </MessagesUsersWrapper>
    )
}

export default MessagesUsers;