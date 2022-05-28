import { Outlet, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";

const EventsWrapper = styled('div', {
    maxWidth: '1700px',
    paddingTop: '$space-5',
});

const EventsBodyWrapper = styled('div', {});

const EventsSidebarWrapper = styled('div', {
    flex: "30%",
});

const EventsContentWrapper = styled('div', {
    flex: "70%",
});

export const Events = ({ isAuth, }) => {
    return (
        <Section>
            <EventsWrapper className="mx-auto">
                <Row className="g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-12">
                        <EventsBodyWrapper className="d-flex flex-column flex-lg-row">
                            <EventsSidebarWrapper>
                                hello
                            </EventsSidebarWrapper>
                            <EventsContentWrapper>
                                <Outlet context={{
                                    isAuth: isAuth,
                                }} />
                            </EventsContentWrapper>
                        </EventsBodyWrapper>
                    </Column>
                </Row>
            </EventsWrapper>
        </Section>
    )
}

export default Events;