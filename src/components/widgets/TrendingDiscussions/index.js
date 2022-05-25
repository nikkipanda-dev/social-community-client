import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoltLightning, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Heading from "../../core/Heading";
import TrendingDiscussionCard from '../TrendingDiscussionCard';

const TrendingDiscussionsWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

export const TrendingDiscussions = ({ isAuth, }) => {
    const discussions = [
        {
            id: 1,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            supporters: 6,
            replies: 10,
        },
        {
            id: 2,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            supporters: 6,
            replies: 10,
        },
        {
            id: 3,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            supporters: 6,
            replies: 10,
        },
    ]

    return (
        <TrendingDiscussionsWrapper>
            <Heading type={6} text={<><FontAwesomeIcon icon={faBoltLightning} className="me-3" />Trending Topics</>} />
        {
            (discussions && (Object.keys(discussions).length > 0)) && 
            Object.keys(discussions).map((i, val) => {
                return <TrendingDiscussionCard key={Object.values(discussions)[val].id} discussion={Object.values(discussions)[val]} />
            })
        }
        </TrendingDiscussionsWrapper>
    )
}

export default TrendingDiscussions;