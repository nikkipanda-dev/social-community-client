import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, } from "@fortawesome/free-solid-svg-icons";
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import Heading from "../../core/Heading";
import Button from "../../core/Button";
import Image from "../../core/Image";

const MessagesInfoWrapper = styled('div', {
    padding: '0px 0px $space-3 $space-3',
    '@media screen and (max-width: 767px)': {
        padding: '0px',
    },
});

const MessagesHeaderWrapper = styled('div', {
    'img': {
        width: '200px',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '100%',
    },
    '@media screen and (max-width: 575px)': {
        'img': {
            width: '150px',
            height: '150px',
        }
    },  
});

const MessagesInfoBody = styled('div', {});

const MiscWrapper = styled('div', {});

const messageImagesStyle = {
    'img': {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '$small',
    },
    '> div': {
        margin: '$space-1',
    },
}

export const MessagesInfo = ({ 
    values, 
    messageImages,
    handleShowModal,
}) => {
    //TODO: paginate images
    return (
        (values && (Object.keys(values).length > 0)) && 
        <MessagesInfoWrapper className="bg-light">
            <MessagesHeaderWrapper className="d-flex flex-column align-items-center">
                <Image src={values.display_photo ? values.display_photo : "/avatar_medium.png"} />
            </MessagesHeaderWrapper>
            <MessagesInfoBody className="d-flex flex-column">
                <MiscWrapper className="align-self-center d-flex flex-column flex-sm-row justify-content-center align-items-center" css={{
                    marginTop: '$space-3',
                }}>
                    <Text type="span" size="medium">
                        {values.user.first_name + " " + values.user.last_name}
                    </Text>
                    <Text 
                    type="span" 
                    size="medium"
                    color="darkGray"
                    className="ms-sm-2">
                        {`@${values.user.username}`}
                    </Text>
                </MiscWrapper>
                <MiscWrapper className="d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between align-items-center">
                    <Button
                    type="button"
                    color="transparent"
                    className="button-plain-red"
                    text={<FontAwesomeIcon icon={faFlag} className="fa-fw" style={{ marginTop: '10px', }} />} />
                    <Button
                    type="button"
                    color="transparent"
                    className="button-plain-red"
                    text={<FontAwesomeIcon icon={faFlag} className="fa-fw" style={{ marginTop: '10px', }} />} />
                </MiscWrapper>
                <hr />
                <MiscWrapper className="d-flex flex-column">
                    <Text type="span" size="medium">Images</Text>
                    <MiscWrapper className="d-flex flex-wrap align-items-center" css={{ ...messageImagesStyle }}>
                    {
                        (messageImages && (Object.keys(messageImages).length > 0)) ?
                            Object.keys(messageImages).map((_, val) =>
                                Object.values(messageImages)[val] && 
                                Object.keys(Object.values(messageImages)[val]).map((a, b) => 
                                    <MiscWrapper key={a} onClick={() => handleShowModal(Object.values(Object.values(messageImages)[val])[b])}>
                                        <Image src={Object.values(Object.values(messageImages)[val])[b]} />
                                </MiscWrapper>)
                            ) : <Text type="span" color="darkGray">No shared images yet.</Text>
                    }
                    </MiscWrapper>
                </MiscWrapper>
            </MessagesInfoBody>
        </MessagesInfoWrapper>
    )
}

export default MessagesInfo;