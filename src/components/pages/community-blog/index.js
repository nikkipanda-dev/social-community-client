import { 
    Outlet, 
    useParams,
    useLocation,
} from "react-router-dom";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import Wordsmiths from "../../widgets/Wordsmiths";

const CommunityBlogWrapper = styled('div', {
    maxWidth: '1700px',
    paddingTop: '$space-5',
});

const CommunityBlogBodyWrapper = styled('div', {
    marginTop: '$space-5',
    '> div': {
        padding: '0px $space-2'
    },
});

const CommunityBlogSidebarWrapper = styled('div', {
    flex: "30%",
});

const CommunityBlogContentWrapper = styled('div', {
    flex: "70%",
});

export const CommunityBlog = ({ isAuth, }) => {
    const params = useParams();
    const location = useLocation();
    
    console.log(location);

    return (
        <Section>
            <CommunityBlogWrapper className="mx-auto">
                <Row className="g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-12">
                        <CommunityBlogBodyWrapper className="d-flex flex-column flex-lg-row">
                        {
                            ((!(params.slug) || (params.slug === "all")) && location.pathname !== "/community-blog/editor") && 
                            <CommunityBlogSidebarWrapper>
                                <Wordsmiths isAuth={isAuth} />
                            </CommunityBlogSidebarWrapper>
                        }
                            <CommunityBlogContentWrapper>
                                <Outlet context={{
                                    isAuth: isAuth,
                                }} />
                            </CommunityBlogContentWrapper>
                        </CommunityBlogBodyWrapper>
                    </Column>
                </Row>
            </CommunityBlogWrapper>
        </Section>
    )
}

export default CommunityBlog;