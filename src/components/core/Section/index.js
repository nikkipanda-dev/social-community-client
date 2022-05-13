import { styled } from "../../../stitches.config";

const SectionWrapper = styled('section', {
    width: '100%',
});

export const Section = ({ className, css, children }) => {
    return (
        <SectionWrapper className={className} css={{ ...css }}>
            {children}
        </SectionWrapper>
    )
}

export default Section;