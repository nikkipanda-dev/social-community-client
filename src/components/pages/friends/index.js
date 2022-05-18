import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import { Friends as FriendsSection } from "../../sections/Friends";
import FriendInvitations from "../../widgets/FriendInvitations";

const FriendsWrapper = styled('div', {
    background: '$lightGray',
    maxWidth: '1700px',
});

export const Friends = () => {
    return (
        <Section>
            <FriendsWrapper className="mx-auto">
                <FriendInvitations />
                <FriendsSection />
            </FriendsWrapper>
        </Section>
    )
}

export default Friends;