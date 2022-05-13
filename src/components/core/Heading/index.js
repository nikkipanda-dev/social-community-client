import { styled } from "../../../stitches.config";

const headingStyle = {
    fontFamily: '$patuaOne',
    letterSpacing: '1px',
};

const Heading1Wrapper = styled('h1',
    headingStyle,
    {
        fontSize: '$heading1',
    },
);

const Heading2Wrapper = styled('h2',
    headingStyle,
    {
        fontSize: '$heading2',
    },
);

const Heading3Wrapper = styled('h3',
    headingStyle,
    {
        fontSize: '$heading3',
    },
);

const Heading4Wrapper = styled('h4',
    headingStyle,
    {
        fontSize: '$heading4',
    },
);

const Heading5Wrapper = styled('h5',
    headingStyle,
    {
        fontSize: '$heading5',
    },
);

const Heading6Wrapper = styled('h6',
    headingStyle,
    {
        fontSize: '$heading6',
    },
);

const headings = {
    1: Heading1Wrapper,
    2: Heading2Wrapper,
    3: Heading3Wrapper,
    4: Heading4Wrapper,
    5: Heading5Wrapper,
    6: Heading6Wrapper,
};

export const Heading = ({
    type,
    className,
    css,
    text,
}) => {
    const HeadingWrapper = headings[type];

    return (
        <HeadingWrapper
            className={'' + (className ? (' ' + className) : '')}
            {...css && { css: { ...css } }}>
            {text}
        </HeadingWrapper>
    )
}

export default Heading;