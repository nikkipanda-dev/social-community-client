import { useState, } from "react";
import { Outlet, Link, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import Button from "../../core/Button";
import DiscussionsSidebar from "../../widgets/DiscussionsSidebar";

const DiscussionsWrapper = styled('div', {
    maxWidth: '1700px',
    paddingTop: '$space-5',
});

const DiscussionsContentWrapper = styled('div', {
    marginTop: '$space-4',
});

const ActionWrapper = styled('div', {});

export const Discussions = ({ isAuth }) => {
    const [isPostDiscussionVisible, setIsPostDiscussionVisible] = useState(false);

    const handleIsPostVisible = () => setIsPostDiscussionVisible(!isPostDiscussionVisible);

    return (
        <Section>
            <DiscussionsWrapper>
                <Row className="g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-12">
                        <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-end align-items-md-center">
                            <Button
                            type="button"
                            className="flex-grow-1 flex-sm-grow-0"
                            color={isPostDiscussionVisible ? '' : 'orange'}
                            text={isPostDiscussionVisible ? "Cancel" : "Start a new discussion"}
                            onClick={() => handleIsPostVisible()} />
                        </ActionWrapper>
                        <DiscussionsContentWrapper className="d-flex">
                            <DiscussionsSidebar 
                            className="flex-shrink-0 sticky-top" 
                            isAuth={isAuth} 
                            css={{ position: 'fixed', }}
                            isContentShown={true}/>
                            <Outlet context={{
                                isAuth: isAuth,
                                isPostDiscussionVisible: isPostDiscussionVisible,
                                handleIsPostVisible: handleIsPostVisible,
                            }} />
                        </DiscussionsContentWrapper>
                    </Column>
                </Row>
            </DiscussionsWrapper>
        </Section>
    )
}

function toggleSidebar() {
    console.info('toggle');
}

export default Discussions;