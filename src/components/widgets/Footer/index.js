import { styled } from "../../../stitches.config";

const FooterWrapper = styled('div', {});

export const Footer = ({ className, css, children }) => {
    return (
        <FooterWrapper className={className} css={{ ...css }}>
            {children}
        </FooterWrapper>
    )
}

export default Footer;