import { useState, useEffect, } from "react";
import { doc, onSnapshot,  } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, } from "@fortawesome/free-solid-svg-icons";
import { styled } from "../../../stitches.config";

import Image from "../../core/Image";
import Text from "../../core/Text";

const MessagesUserCardWrapper = styled('div', {
    '> div': {
        background: '$white',
        padding: '$space-3 $space-2',
        transition: '$default',
    },
    'img': {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
    },
    '> div:hover': {
        cursor: 'pointer',
        background: '$lightGray',
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

export const MessagesUserCard = ({ 
    values, 
    onSelect,
    firebase,
}) => {
    console.log('vakues ', values);

    const [lastMessage, setLastMessage] = useState();

    const handleLastMessage = lastMessage => setLastMessage(lastMessage);

    console.info('messae ', lastMessage);

    useEffect(() => {
        let loading = true;

        if (loading && firebase && (Object.keys(firebase).length > 0) && firebase[0].auth.currentUser) {
            const db = firebase[0].db;
            const id = (firebase[0].auth.currentUser.uid < values.uid) ? firebase[0].auth.currentUser.uid + "-" + values.uid : values.uid + "-" + firebase[0].auth.currentUser.uid;

            const docRef = doc(db, "lastMessages", id);
            let lastMessage = [];

            onSnapshot(docRef, doc => {
                console.log("CURRENT DATA: ", doc.data());
                lastMessage.push(doc.data());
                if (doc.exists()) {
                    handleLastMessage(doc.data());
                } else {
                    console.log("CURRENT DATA: NONE"); 
                }
            });
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        (values && (Object.keys(values).length > 0)) && 
        <MessagesUserCardWrapper onClick={() => onSelect(values)}>
            <div className="d-flex align-items-start">
                <Image src="/avatar_medium.png" />
                <ContentWrapper className="d-flex flex-column">
                    <ContentWrapper className="d-flex justify-content-end justify-content-md-between flex-grow-1">
                        <MiscWrapper>
                            <Text type="span">{values.first_name + " " + values.last_name}</Text><br />
                            <Text type="span" color="darkGray">{"@" + values.username}</Text>
                        </MiscWrapper>
                        <NotificationWrapper>
                            <Text type="span" css={{
                                color: '$orangeRedCrayola',
                                fontWeight: 'bold',
                                maxWidth: 'max-content',
                                padding: '$space-2 $space-2 $space-1',
                            }}>1</Text>
                            <Text type="span" color={values.isOnline ? "green" : "lightGray2"}>
                                <FontAwesomeIcon icon={faCircle} className="fa-fw fa-xs ms-2" />
                            </Text>
                        </NotificationWrapper>
                    </ContentWrapper>
                    {
                        (lastMessage && (Object.keys(lastMessage).length > 0)) &&
                        <ContentWrapper className="d-flex justify-content-end justify-content-md-between flex-grow-1">
                            <MiscWrapper>
                                <Text type="span">{lastMessage.message}</Text>
                            </MiscWrapper>
                        </ContentWrapper>
                    }
                </ContentWrapper>
            </div>
        </MessagesUserCardWrapper>
    )
}

export default MessagesUserCard;