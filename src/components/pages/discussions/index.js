import { Outlet, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import UserDiscussions from "../../sections/UserDiscussions";

const DiscussionsWrapper = styled('div', {
    maxWidth: '1700px',
});

export const Discussions = () => {
    return (
        <Section>
            <DiscussionsWrapper>
                <UserDiscussions />
            </DiscussionsWrapper>
        </Section>
    )
}

export default Discussions;