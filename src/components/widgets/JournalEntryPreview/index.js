import TipTapEditor from "../TipTapEditor";
import { styled, richTextStyle, } from "../../../stitches.config";

import Heading from "../../core/Heading";
import Text from "../../core/Text";
import ImagesPreview from "../ImagesPreview";

const JournalEntryPreviewWrapper = styled('div', {
    padding: '0'
});

const TitleWrapper = styled('div', {
    padding: '$space-2',
});

const DateWrapper = styled('div', {
    padding: '$space-2',
});

const JournalEntryContentWrapper = styled('div', richTextStyle);

const JournalEntryHeaderWrapper = styled('div', {});

export const JournalEntryPreview = ({ 
    content, 
    images,
    isEditable, 
    handleOutput, 
    limit,
    title,
    isTitleShown,
    className,
    css,
    date,
}) => {
    return (
        <JournalEntryPreviewWrapper className={"" + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <JournalEntryHeaderWrapper className="d-flex flex-wrap justify-content-md-between align-items-md-start">
                <TitleWrapper>
                {
                    isTitleShown && 
                    <Heading type={6} text={title} />
                }
                </TitleWrapper>
                <DateWrapper>
                    <Text type="span" css={{ display: 'inline-block', color: '$darkGray', }}>
                    {
                        date &&
                        new Intl.DateTimeFormat('en-US', {
                            timeZone: 'Asia/Manila',
                            hourCycle: 'h12',
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(new Date(date))
                    }
                    </Text>
                </DateWrapper>
            </JournalEntryHeaderWrapper>
            <JournalEntryContentWrapper className="p-1">
                <ImagesPreview
                images={images}
                bodyClassName="p-1 d-flex flex-wrap justify-content-center align-items-center" />
                <TipTapEditor
                isEditable={isEditable}
                {...handleOutput && { handleOutput: handleOutput }}
                limit={limit}
                content={content} />
            </JournalEntryContentWrapper>
        </JournalEntryPreviewWrapper>
    )
}

export default JournalEntryPreview;