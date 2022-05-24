import { useState, useEffect, } from "react";
import { 
    useParams, 
    useOutletContext, 
    useNavigate,
} from "react-router-dom";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faFlag, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Heading from "../../core/Heading";
import Text from "../../core/Text";
import Button from "../../core/Button";
import DiscussionPostReplies from "../DiscussionPostReplies";
import DiscussionPostSupporters from "../DiscussionPostSupporters";

const DiscussionPostWrapper = styled('div', {
    width: '100%',
    padding: '0px $space-3',
});

const DiscussionPostHeaderWrapper = styled('div', {
    marginTop: '$space-3',
});

const DiscussionPostTitleWrapper = styled('div', {});

const DiscussionPostMiscWrapper = styled('div', {
    marginTop: '$space-5',
});

const DiscussionPostContentWrapper = styled('div', {
    marginTop: '$space-5',
});

const MiscWrapper = styled('div', {
    padding: '$space-3',
});

export const DiscussionPost = () => {
    const params = useParams();
    const navigate = useNavigate();
    const context = useOutletContext();

    const [values, setValues] = useState('');

    const handleValues = values => setValues(values);

    const handleNavigator = () => {
        navigate('../');
    }

    useEffect(() => {
        let loading = true;

        if (loading & context.isAuth && params.slug) {
            getDiscussionPost(params.slug).then (response => {
                console.log(response.data);
                if (response.data.isSuccess) {
                    handleValues(response.data.data.details);
                } else {
                    console.error('err get ', response.data.data.errorText);   
                }
            })

            .catch (err => {
                console.error('err get ', err.response.data.errors);
            });
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        (context.isAuth && (values && Object.keys(values).length > 0)) && 
        <DiscussionPostWrapper>
            <MiscWrapper className="d-flex flex-column flex-sm-row justify-content-md-between align-items-md-center" css={{ padding: '0px', }}>
                <Button 
                type="button" 
                text={<Text type="span"><FontAwesomeIcon icon={faCaretLeft} className="fa-fw me-2" />Back</Text>} 
                onClick={() => handleNavigator()} />
                <Button
                type="button"
                color="red"
                text={<Text type="span"><FontAwesomeIcon icon={faFlag} className="fa-fw me-2" />Report</Text>} />
            </MiscWrapper>
            <DiscussionPostHeaderWrapper className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-center align-items-lg-start">
                <DiscussionPostTitleWrapper>
                    <Heading type={5} text={(values && values.title) && values.title} />
                    <Text type="span">{(values && (values.user.first_name && values.user.last_name)) && (values.user.first_name + ' ' + values.user.last_name)}</Text> <Text type="span" color="darkGray">{(values && (values.user.username)) && ('@' + values.user.username)}</Text>
                </DiscussionPostTitleWrapper>
                <Text type="span" color="darkGray">{(values && (values.created_at)) &&
                    new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Asia/Manila',
                        hourCycle: 'h12',
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    }).format(new Date(values.created_at))}
                </Text>
            </DiscussionPostHeaderWrapper>
            <DiscussionPostContentWrapper>
                <Text type="paragraph">{(values && values.body) && values.body}</Text>
            </DiscussionPostContentWrapper>
            <DiscussionPostMiscWrapper className="d-flex flex-column flex-xl-row">
                <MiscWrapper css={{ flex: '55%' }}>
                    <DiscussionPostReplies slug={(values && values.slug) && values.slug} isAuth={context.isAuth} />
                </MiscWrapper>
                <MiscWrapper css={{ 
                    flex: '45%', 
                    background: '$lightGray',
                    borderRadius: '$default',
                }}>
                    <DiscussionPostSupporters slug={(values && values.slug) && values.slug} isAuth={context.isAuth} />
                </MiscWrapper>
            </DiscussionPostMiscWrapper>
        </DiscussionPostWrapper>
    )
}

function getDiscussionPost(slug) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "discussion-posts/get", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
            slug: slug,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default DiscussionPost;