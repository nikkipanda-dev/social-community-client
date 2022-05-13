import { styled } from "../../../stitches.config";

import UserItem from "./Item";
import UserCard from "./Card";

const userType = {
    card: UserCard,
    item: UserItem,
}

export const User = ({
    type,
    className,
    background,
    css,
    action,
    member,
    onClick,
    evtOnclick,
}) => {
    const Member = userType[type];

    return (
        <Member
        className={className}
        css={css}
        action={action}
        member={member}
        onClick={onClick}
        evtOnclick={evtOnclick}
        background={background} />
    )
}

export default User;