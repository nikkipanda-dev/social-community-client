import { styled } from "../../../stitches.config";

const LandingPageWrapper = styled('div', {
    background: 'blue',
    width: '100%',
    minHeight: '100vh',
    background: "center / cover no-repeat url('/backdrop_ver_1.png')",
});

export const LandingPage = () => {
    return (
        <LandingPageWrapper>
            Landing page
        </LandingPageWrapper>
    )
}

export default LandingPage;