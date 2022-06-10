import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import Heading from "../../core/Heading";
import Image from "../../core/Image";

const MessagesInfoWrapper = styled('div', {
    padding: '0px 0px $space-3 $space-3',
    '@media screen and (max-width: 767px)': {
        padding: '0px',
    },
});

const MessagesHeaderWrapper = styled('div', {
    'img': {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
    },
});

const MessagesInfoBody = styled('div', {});

export const MessagesInfo = ({ values, }) => {
    return (
        (values && (Object.keys(values).length > 0)) && 
        <MessagesInfoWrapper>
            <MessagesHeaderWrapper className="d-flex flex-column align-items-center">
                <Image src="/avatar_medium.png" />
            </MessagesHeaderWrapper>
            <MessagesInfoBody className="d-flex flex-column">
                <Text type="span">{values.user.first_name + " " + values.user.last_name}</Text>
            </MessagesInfoBody>
        </MessagesInfoWrapper>
    )
}

export default MessagesInfo;