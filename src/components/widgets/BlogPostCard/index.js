import { useState, } from 'react';
import { useNavigate, } from 'react-router-dom';
import TipTapEditor from '../TipTapEditor';
import { richTextStyle } from '../../../stitches.config';
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import Heading from "../../core/Heading";
import Text from "../../core/Text";
import Button from "../../core/Button";

const BlogPostCardWrapper = styled('div', {
    'a': {
        textDecoration: 'unset',
        color: '$pineGreen',
    },
    'a:hover': {
        color: '$darkGray',
    },
});

const BlogPostPreviewWrapper = styled('div', {
    padding: '$space-2',
    background: '$white',
    borderRadius: '$small',
    marginTop: '30px',
});

const BlogPostActionWrapper = styled('div', {});

export const BlogPostCard = () => {
    const navigate = useNavigate();

    const [details, setDetails] = useState({
        id: 1,
        title: "Lorem ipsum dolor sit amet.",
        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, excepturi!",
    });

    const handleNavigate = () => console.log('slug');

    return (
        <BlogPostCardWrapper>
            <Card 
            header={
                <>
                    <Text type="span" size="large">{(details && details.title) && details.title}</Text>
                </>
            } 
            css={{ padding: '$space-3', borderRadius: '$default', }}>
                <BlogPostPreviewWrapper>
                    <Text type="paragraph" css={{ textAlign: 'justify', }}>{(details && details.body) && details.body}</Text>
                </BlogPostPreviewWrapper>
                <BlogPostActionWrapper className="d-grid col-sm-9 col-md-8 col-lg-6 col-xl-5 mx-auto mt-3">
                    <Button 
                    type="button" 
                    text="Read more" 
                    onClick={() => handleNavigate()}
                    color="brown" />
                </BlogPostActionWrapper>
            </Card>
        </BlogPostCardWrapper>
    )
}

export default BlogPostCard;