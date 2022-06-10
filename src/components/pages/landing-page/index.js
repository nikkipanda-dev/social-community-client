import { styled } from "../../../stitches.config";

const LandingPageWrapper = styled('div', {
    width: '100%',
    minHeight: '100vh',
});

export const LandingPage = () => {
    return (
        <LandingPageWrapper>
            Landing page
        </LandingPageWrapper>
    )
}

export default LandingPage;