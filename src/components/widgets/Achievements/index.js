import { styled } from "../../../stitches.config";

import Card from "../../core/Card";

const AchievementsWrapper = styled('div', {});

export const Achievements = () => {
    return (
        <AchievementsWrapper>
            <Card css={{ padding: '$space-3', borderRadius: '$default', }}>
                Achievements
            </Card>
        </AchievementsWrapper>
    )
}

export default Achievements;