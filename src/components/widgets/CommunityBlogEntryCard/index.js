import { useNavigate, } from "react-router-dom";
import TipTapEditor from "../TipTapEditor";
import { richTextStyle, styled } from "../../../stitches.config";

import Heading from "../../core/Heading";
import Text from "../../core/Text";
import Button from "../../core/Button";
import Card from "../../core/Card";

const CommunityBlogCardWrapper = styled('div', {});

const CommunityBlogBodyWrapper = styled('div', {});

const CommunityBlogContentWrapper = styled('div', 
    richTextStyle,
    {
        background: '$white',
        padding: '0px $space-1 $space-5',
        borderRadius: '$small',
        boxShadow: "inset 0px -50px 30px -20px #F6F6F6",
    }
);

const ActionWrapper = styled('div', {
    marginTop: '$space-3',
});

export const CommunityBlogCard = ({ values, }) => {
    const navigate = useNavigate();

    const handleNavigator =() => {
        navigate("/community-blog/post/" + (values && values.slug));
    }

    return (
        (values && (Object.keys(values).length > 0)) && 
        <CommunityBlogCardWrapper>
            <Card css={{ padding: '$space-3', borderRadius: '$default', }}>
                <CommunityBlogBodyWrapper>
                    <Heading type={6} text={values.title} />
                    {
                        (values && values.body) && 
                        <CommunityBlogContentWrapper>
                            <TipTapEditor content={JSON.parse(values.body)} isEditable={false} css={{ maxHeight: '10vh', overflow: 'hidden', }}/>
                        </CommunityBlogContentWrapper>
                    }
                    <ActionWrapper className="d-flex justify-content-center align-items-center">
                        <Button
                        type="button"
                        text="Read more"
                        className="flex-grow-1 flex-sm-grow-0"
                        color="brown"
                        onClick={() => handleNavigator()} />
                    </ActionWrapper>
                </CommunityBlogBodyWrapper>
            </Card>
        </CommunityBlogCardWrapper>
    )
}

export default CommunityBlogCard;