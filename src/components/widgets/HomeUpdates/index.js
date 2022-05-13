import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Heading from "../../core/Heading";
import UpcomingEvents from "../UpcomingEvents";
import TrendingDiscussions from "../TrendingDiscussions";
import RecentMembers from "../RecentMembers";
import BlogPostCard from "../BlogPostCard";

const HomeUpdatesWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '60px',
    },
    '> div': {
        // maxWidth: 'inherit',
    },
});

const UpcomingEventsWrapper = styled('div', {});

const FeaturedBlogWrapper = styled('div', {});

const TrendingDiscussionsWrapper = styled('div', {});

const RecentMembersWrapper = styled('div', {});

export const HomeUpdates = () => {
    return (
        <HomeUpdatesWrapper>
            <UpcomingEventsWrapper>
                <UpcomingEvents />
            </UpcomingEventsWrapper>
            <FeaturedBlogWrapper>
                <Heading type={6} text={<><FontAwesomeIcon icon={faStar} className="me-3" />Featured Blog Post</>} />
                <BlogPostCard />
            </FeaturedBlogWrapper>
            <TrendingDiscussionsWrapper>
                <TrendingDiscussions />
            </TrendingDiscussionsWrapper>
            <RecentMembersWrapper>
                <RecentMembers />
            </RecentMembersWrapper>
        </HomeUpdatesWrapper>
    )
}

export default HomeUpdates;