import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart, faComments,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Card from "../../core/Card";
import Text from "../../core/Text";

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

export const MicroblogStat = () => {
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
                            <Text type="span">Most <FontAwesomeIcon icon={faHeart} className="fa-fw fa-lg ms-2" style={{ color: '#F95F5F', }} />:</Text> 
                            <MostLovedPostContentWrapper>
                                Lorem ipsum dolor sit amet.
                            </MostLovedPostContentWrapper>
                        </MostLovedPostWrapper>
                        <MostActivePostWrapper>
                            <Text type="span">Most <FontAwesomeIcon icon={faComments} className="fa-fw fa-lg ms-2" style={{ color: '#666666', }} />:</Text>
                            <MostActivePostContentWrapper>
                                Lorem ipsum dolor sit amet.
                            </MostActivePostContentWrapper>
                        </MostActivePostWrapper>
                    </MicroblogStatContentWrapper>
                </MicroblogStatBodyWrapper>
            </Card>
        </MicroblogStatWrapper>
    )
}

export default MicroblogStat;