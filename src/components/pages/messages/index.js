import { Outlet, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import MessagesSidebar from "../../widgets/MessagesSidebar";

const MessagesWrapper = styled('div', {
    maxWidth: '1700px',
    paddingTop: '$space-5',
});

export const Messages = ({ isAuth, }) => {
    return (
        <Section>
            <MessagesWrapper className="mx-auto">
                <Row className="g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-sm-3">
                        <MessagesSidebar />
                    </Column>
                    <Column className="bg-secondary col-sm-9">
                        <Outlet context={{
                            isAuth: isAuth,
                        }} />
                    </Column>
                </Row>
            </MessagesWrapper>
        </Section>
    )
}

export default Messages;