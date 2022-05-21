import { Outlet, } from "react-router-dom";
import { DiscussionsSidebarItems } from "../../../util/NavLinks/Discussions";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import Sidebar from "../../widgets/Sidebar";

const DiscussionsWrapper = styled('div', {
    maxWidth: '1700px',
    paddingTop: '$space-5',
});

const ProfileSidebarWrapper = styled('div', {
    background: 'red',
    padding: '$space-1',
    overflow: 'scroll',
    maxHeight: '100vh',
    boxSizing: 'border-box',
    width: '100%',
    '> div:nth-child(n+2)': {
        marginTop: '$space-4',
    },
    '> div': {
        padding: '0px $space-3 0px 0px',
    },
});

export const Discussions = ({ isAuth }) => {
    return (
        <Section>
            <DiscussionsWrapper className="bg-warning">
                <Row className="bg-primary g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-md-3 bg-secondary">
                        <ProfileSidebarWrapper className="sticky-top">
                            <Sidebar
                            isContentShown
                            items={DiscussionsSidebarItems} />
                        </ProfileSidebarWrapper>
                    </Column>
                    <Column className="col-md-9 bg-light">
                        <Outlet context={{
                            isAuth: isAuth,
                        }} />
                    </Column>
                </Row>
            </DiscussionsWrapper>
        </Section>
    )
}

export default Discussions;