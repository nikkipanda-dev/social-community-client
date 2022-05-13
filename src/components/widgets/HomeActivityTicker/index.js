import { Link, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faComment, 
    faCalendarDay,
    faBlog,
    faChalkboard,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Card from '../../core/Card';
import Text from '../../core/Text';

const HomeActivityTickerWrapper = styled('div', {
    'a': {
        textDecoration: 'unset',
        color: '$pineGreen',
    },
    'a:hover': {
        color: '$darkGray',
    },
});

export const HomeActivityTicker = ({
    activity, 
}) => {
    const HomeActivityPreviewWrapper = styled('div', {
        padding: '$space-1 $space-1 0px $space-1',
        background: '$white',
        borderRadius: '$small',
        marginTop: '$space-3',
    });

    return (
        <HomeActivityTickerWrapper>
            <Card
            header={<>
                <FontAwesomeIcon icon={
                (activity && activity.type) ?
                (
                    (activity.type === 'comment') ? faComment :
                    (activity.type === 'blog') ? faBlog :
                    (activity.type === 'discussion') ? faChalkboard :
                    (activity.type === 'event') ? faCalendarDay : ''
                ) : ' no activity or type'
                } className="fa-2xl me-2" />
                <Text type="span" size="medium">
                {
                    (activity && activity.type) ?
                    (
                        (activity.type === 'comment') ? 
                        <>
                            <Text type="span" size="medium">@{activity.username} commented on a </Text>
                            <Link to="/post">{activity.section}</Link>
                        </> :
                        (activity.type === 'blog') ? 
                        <>
                            <Text type="span" size="medium">@{activity.username} posted on community blog</Text>
                        </> :
                        (activity.type === 'discussion') ? 
                        <>
                            <Text type="span" size="medium">@{activity.username} started a discussion</Text>
                        </> :
                        (activity.type === 'event') ? 
                        <>
                            <Text type="span" size="medium">@{activity.username} created an event</Text>
                        </> : ''
                    ) : ' no activity'
                }
                </Text>
            </>}
            css={{ padding: '$space-3', borderRadius: '$default', }}>
                <HomeActivityPreviewWrapper className={(activity && !(activity.type === "comment")) ? 'text-center' : 'none'}>
                    <Text 
                    type="span" 
                    as="blockquote" 
                    css={{
                        borderLeft: (activity && ((activity.type === "comment"))) ? '$default' : '0px',
                        borderLeftWidth: (activity && ((activity.type === "comment"))) ? '$default' : '0px',
                        borderLeftStyle: '$default',
                        padding: '$space-3',
                        marginTop: '$space-3',
                        display: 'inline-block',
                    }}>
                    {
                        (activity && activity.type) ?
                        (
                            (activity.type === 'comment') ?
                            <Link to="/post">
                                <Text type="span">{activity.preview}</Text>
                            </Link> :
                            (activity.type === 'blog') ?
                            <Link to="/post">
                                <Text type="span" size="medium">{activity.title}</Text>
                            </Link> :
                            (activity.type === 'discussion') ?
                            <Link to="/post" >
                                <Text type="span" size="medium">{activity.title}</Text>
                            </Link> :
                            (activity.type === 'event') ?
                            <Link to="/post" className="d-flex flex-column">
                                <Text type="span" size="medium">{activity.name}</Text>
                                <Text type="span" color="darkGray">{activity.start_date + ' ' + activity.end_date}</Text>
                            </Link> : ''
                        ) : ' no activity'
                    }
                    </Text>
                </HomeActivityPreviewWrapper>
            </Card>
        </HomeActivityTickerWrapper>
    )
}

export default HomeActivityTicker;