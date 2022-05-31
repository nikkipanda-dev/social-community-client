import { styled } from "../../../stitches.config";

import Image from "../../core/Image";
import Text from "../../core/Text";

const MessagesUserCardWrapper = styled('div', {
    background: '$lightGray',
    padding: '$space-3 $space-2',
    'img': {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
    },
});

const ContentWrapper = styled('div', {});

const MiscWrapper = styled('div', {
    marginLeft: '$space-2',
    display: 'block',
    '@media screen and (max-width: 767px)': {
        display: 'none',
    },
});

const NotificationWrapper = styled('div', {
    marginLeft: '0',
    '@media screen and (max-width: 767px)': {
        marginLeft: '$space-2',
    },
});

export const MessagesUserCard = ({ values, }) => {
    return (
        (values && (Object.keys(values).length > 0)) && 
        <MessagesUserCardWrapper className="d-flex align-items-start">
            <Image src="/avatar_medium.png" />
            <ContentWrapper className="d-flex justify-content-end justify-content-md-between flex-grow-1">
                <MiscWrapper>
                    <Text type="span">{values.first_name + " " + values.last_name}</Text><br />
                    <Text type="span" color="darkGray">{"@" + values.username}</Text>
                </MiscWrapper>
                <NotificationWrapper>
                    <Text type="span" css={{
                        color: '$white',
                        fontWeight: 'bold',
                        background: '$orangeRedCrayola',
                        maxWidth: 'max-content',
                        padding: '$space-2 $space-2 $space-1'
                    }}>1</Text>
                </NotificationWrapper>
            </ContentWrapper>
        </MessagesUserCardWrapper>
    )
}

export default MessagesUserCard;