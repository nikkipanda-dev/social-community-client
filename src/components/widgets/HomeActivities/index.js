import { styled } from "../../../stitches.config";

import HomeActivityTicker from "../HomeActivityTicker";

const HomeActivitiesWrapper = styled('div', {
    '> :nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

export const HomeActivities = ({ activities }) => {
    return (
        <HomeActivitiesWrapper>
        {
            (activities && (Object.keys(activities).length > 0)) &&
            Object.keys(activities).map((i, val) => {
                return <HomeActivityTicker key={Object.values(activities)[val].id} activity={Object.values(activities)[val]} />
            })
        }
        </HomeActivitiesWrapper>
    )
}

export default HomeActivities;