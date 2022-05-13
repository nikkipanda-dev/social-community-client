import { styled } from "../../../../stitches.config";

import Image from "../../../core/Image";
import Text from "../../../core/Text";
import Button from "../../../core/Button";

const UserCardWrapper = styled('div', {});

export const UserCard = ({
    members,
    className,
    background,
    css,
    member,
    onClick,
    evtOnclick,
}) => {
    return (
        <UserCardWrapper
            className={'d-flex flex-column align-items-center' + (className ? (' ' + className) : '')}
            {...background && { background: background }}
            {...member && { member: member }}
            {...onClick && { onClick: () => onClick() }}
            {...evtOnclick && { onClick: evt => evtOnclick(evt) }}
            {...css & { css: { ...css } }}>
            <Image
                className="d-none d-sm-block"
                src="/avatar_medium.png"
                css={{ width: '100%', maxWidth: '150px', height: 'auto' }} />
            <Text type="span" size="medium">First Name Last Name</Text>
            <Text type="span" color="darkGray">@username</Text>
            <Button type="button" text="Button" />
        </UserCardWrapper>
    )
}

export default UserCard;