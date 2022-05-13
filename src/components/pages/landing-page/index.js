import { styled } from "../../../stitches.config";

const LandingPageWrapper = styled('div', {
    background: 'blue',
    width: '100%',
});

export const LandingPage = () => {
    return (
        <LandingPageWrapper>
            Landing page
        </LandingPageWrapper>
    )
}

export default LandingPage;