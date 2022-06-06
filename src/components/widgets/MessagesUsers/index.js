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

export const MessagesUsers = ({ 
    users, 
    onSelect,
}) => {
    return (
        <MessagesUsersWrapper>
            <MessagesUserGroupWrapper>
            {
                (users && (Object.keys(users).length > 0)) && 
                Object.keys(users).map((i, val) => <MessagesUserCard 
                key={Object.values(users)[val].uid} 
                values={Object.values(users)[val]}
                onSelect={onSelect} />)
            }
            </MessagesUserGroupWrapper>
        </MessagesUsersWrapper>
    )
}

export default MessagesUsers;