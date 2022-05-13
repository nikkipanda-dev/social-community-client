import { styled } from "../../../stitches.config";

import Card from "../../core/Card";

const BadgesWrapper = styled('div', {});

export const Badges = () => {
    return (
        <BadgesWrapper>
            <Card css={{ padding: '$space-3', borderRadius: '$default', }}>
                Badges
            </Card>
        </BadgesWrapper>
    )
}

export default Badges;