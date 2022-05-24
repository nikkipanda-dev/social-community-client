import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import TrendingDiscussionCard from "../TrendingDiscussionCard";

const DiscussionPostTrendingWrapper = styled('div', {});

export const DiscussionPostTrending = () => {
    return (
        <DiscussionPostTrendingWrapper>
            <Text type="span" size="large">Trending</Text>
            <TrendingDiscussionCard />
        </DiscussionPostTrendingWrapper>
    )
}

export default DiscussionPostTrending;