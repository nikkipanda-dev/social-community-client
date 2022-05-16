import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComments, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import Text from "../../core/Text";
import Button from '../../core/Button';

const MicroblogStatWrapper = styled('div', {
    width: '100%',
});

const MicroblogStatBodyWrapper = styled('div', {});

const MicroblogStatContentWrapper = styled('div', {
    marginTop: '$space-3',
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
    '> div > div': {
        marginTop: '$space-1',
    },
});

const PostCountWrapper = styled('div', {});

const MostLovedPostWrapper = styled('div', {});

const MostActivePostWrapper = styled('div', {});

const ButtonWrapper = styled('div', {
    marginTop: '$space-5 ',
});

const statPreviewStyle = {
    background: '$white',
    padding: '$space-2',
    borderRadius: '$small',
}

const MostLovedPostContentWrapper = styled('div', 
    statPreviewStyle,
    {}
);

const MostActivePostContentWrapper = styled('div', 
    statPreviewStyle,
    {}
);

export const MicroblogStat = ({ mostLovedMicroblogEntry, mostActiveMicroblogEntry, }) => {
    return (
        <MicroblogStatWrapper>
            <Card css={{ padding: '$space-3', borderRadius: '$default', }}>
                <MicroblogStatBodyWrapper>
                    <Text type="span" size="large">Stat</Text>
                    <MicroblogStatContentWrapper className="d-flex flex-column">
                        <PostCountWrapper>
                            Number of posts: <Text type="span">10</Text>
                        </PostCountWrapper>
                        <MostLovedPostWrapper className="d-flex flex-column">
                            <div className="d-flex justify-content-between">
                                <Text type="span">Most loved:</Text>
                                <Text type="span">
                                {(mostLovedMicroblogEntry && mostLovedMicroblogEntry.microblog_entry_hearts_count) && mostLovedMicroblogEntry.microblog_entry_hearts_count} <FontAwesomeIcon 
                                    icon={faHeart} 
                                    className="fa-fw fa-lg" 
                                    style={{ color: '#F95F5F', }} />
                                </Text>
                            </div>
                            <MostLovedPostContentWrapper>
                                <Text type="paragraph">
                                    {(mostLovedMicroblogEntry && mostLovedMicroblogEntry.body) ? ((mostLovedMicroblogEntry.body).slice(0,100) + '...') : "None yet."}
                                </Text>
                            </MostLovedPostContentWrapper>
                            <ButtonWrapper className="d-flex justify-content-md-center align-items-center">
                                <Button 
                                type="button" 
                                className="flex-grow-1 flex-md-grow-0" 
                                text="Go to post" />
                            </ButtonWrapper>
                        </MostLovedPostWrapper>
                        <MostActivePostWrapper className="d-flex flex-column">
                            <div className="d-flex justify-content-between">
                                <Text type="span">Most active:</Text>
                                <Text type="span">
                                    {(mostActiveMicroblogEntry && mostActiveMicroblogEntry.microblog_entry_comments_count) && mostActiveMicroblogEntry.microblog_entry_comments_count} <FontAwesomeIcon 
                                    icon={faComments} 
                                    className="fa-fw fa-lg" 
                                    style={{ color: '#666666', }} />
                                </Text>
                            </div>
                            <MostActivePostContentWrapper>
                                <Text type="paragraph">{(mostActiveMicroblogEntry && mostActiveMicroblogEntry.body) ? (mostActiveMicroblogEntry.body.slice(0,100) + '...') : 'None yet.'}</Text>
                            </MostActivePostContentWrapper>
                            <ButtonWrapper className="d-flex justify-content-md-center align-items-center">
                                <Button 
                                type="button" 
                                className="flex-grow-1 flex-md-grow-0" 
                                text="Go to post" />
                            </ButtonWrapper>
                        </MostActivePostWrapper>
                    </MicroblogStatContentWrapper>
                </MicroblogStatBodyWrapper>
            </Card>
        </MicroblogStatWrapper>
    )
}

export default MicroblogStat;