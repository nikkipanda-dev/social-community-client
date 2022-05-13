import { styled } from "../../../../stitches.config";

import Text from "../../../core/Text";
import Image from "../../../core/Image";
import Card from "../../../core/Card";

const UserItemWrapper = styled('div', {});

const UserContentWrapper = styled('div', {});

const UserDetailsWrapper = styled('div', {});

const UserNameWrapper = styled('div', {});

const ImageWrapper = styled('div', {});

const UserItemDetails = styled('div', {});

export const UserItem = ({
    member,
    className,
    action,
    background,
    css,
    onClick,
    evtOnclick,
}) => {
    return (
        <UserItemWrapper>
            <Card className={' ' + (className ? (' ' + className) : '')} css={{ padding: '$space-2', borderRadius: '$default', }}>
                <UserItemDetails className="d-flex flex-wrap align-items-center">
                    <ImageWrapper>
                        <Image
                        src="/avatar_medium.png"
                        css={{
                            width: '100%',
                            maxWidth: '60px',
                            height: 'auto'
                        }} />
                    </ImageWrapper>
                    <UserContentWrapper className="flex-grow-1 d-flex flex-row justify-content-between align-items-start ms-0 ms-md-2">
                        <UserDetailsWrapper className="d-flex flex-column align-items-start">
                            <UserNameWrapper className="d-flex flex-column">
                                <Text type="span" size="medium">
                                {
                                    (member && member.user) ? (member.user.first_name + ' ' + member.user.last_name) :
                                        (member && (member.first_name && member.last_name)) ? (member.first_name + ' ' + member.last_name) : ''
                                }
                                </Text>
                                <Text type="span" className={(member && member.title) && "ms-2"} color="darkGray">@
                                {
                                    (member && member.user) ? member.user.username :
                                    (member && member.username) ? member.username : ''
                                }
                                </Text>
                            </UserNameWrapper>
                            <Text type="span">{(member && member.title) && member.title}</Text>
                        </UserDetailsWrapper>
                    </UserContentWrapper>
                </UserItemDetails>
            </Card>
        </UserItemWrapper>
    )
}

export default UserItem;