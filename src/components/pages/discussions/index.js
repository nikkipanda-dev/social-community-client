import { useState, useEffect, useLayoutEffect, } from "react";
import { 
    Outlet, 
    useParams,
    useNavigate,
} from "react-router-dom";
import { Select } from 'antd';
import { DiscussionsSidebarItems } from "../../../util/NavLinks/Discussions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import Button from "../../core/Button";
import Text from "../../core/Text";
import DiscussionsSidebar from "../../widgets/DiscussionsSidebar";

const DiscussionsWrapper = styled('div', {
    maxWidth: '1700px',
    paddingTop: '$space-5',
});

const DiscussionsBodyWrapper = styled('div', {
    marginTop: '$space-4',
});

const DiscussionsContentWrapper = styled('div', {
    marginTop: '$space-4',
    '> div': {
        padding: '0px $space-3',
    },
});

const ActionWrapper = styled('div', {});

const FilterWrapper = styled('div', {
    marginBottom: '$space-3',
    'div.ant-select': {
        border: '1px solid $lightGray1 !important',
        width: '200px',
    },
    'div.ant-select > div.ant-select-selector, div.ant-select > div.ant-select-selector > span.ant-select-selector > span.ant-select-selection-search > input': {
        boxShadow: 'unset !important',
        outline: 'unset',
    },
    'div.ant-select > div.ant-select-selector > span.ant-select-selector > span.ant-select-selection-search > input': {
        border: '1px solid $lightGray2 !important',
    },
    'div.ant-select > div.ant-select-selector': {
        border: 'unset !important',
    },
});

const { Option } = Select;

export const Discussions = ({ isAuth, }) => {
    const params = useParams();
    const navigate = useNavigate();
    const [isPostDiscussionVisible, setIsPostDiscussionVisible] = useState(false);

    const handleIsPostVisible = () => setIsPostDiscussionVisible(!isPostDiscussionVisible);

    const handleNavigator = value => {
        (value === "all") ? navigate("/discussions") : navigate(value);
    }

    const categories = {
        hobbies: 'hobby',
        wellbeing: 'wellbeing',
        career: 'career',
        coaching: 'coaching',
        "science-and-tech": 'science_and_tech',
        "social-causes": 'social_cause',
    }

    return (
        <Section>
            <DiscussionsWrapper className="mx-auto">
                <Row className="g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-12">
                        <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-end align-items-md-center">
                        {
                            (!(params.slug) || (params.slug === 'hobbies') || (params.slug === 'wellbeing') || (params.slug === 'career') || (params.slug === 'coaching') || (params.slug === 'science-and-tech') || (params.slug === 'social-causes')) && 
                            <Button
                            type="button"
                            className="flex-grow-1 flex-sm-grow-0"
                            color={isPostDiscussionVisible ? '' : 'orange'}
                            text={isPostDiscussionVisible ? "Cancel" : "Start a new discussion"}
                            onClick={() => handleIsPostVisible()} />   
                        }
                        </ActionWrapper>
                        <DiscussionsBodyWrapper className="d-flex flex-column">
                        {
                            ((!(params.slug) || (params.slug === 'hobbies') || (params.slug === 'wellbeing') || (params.slug === 'career') || (params.slug === 'coaching') || (params.slug === 'science-and-tech') || (params.slug === 'social-causes'))) && 
                            <FilterWrapper>
                                <Text type="span" className="me-3">Filter:</Text>
                                <Select 
                                value={params.slug ? params.slug : "all"}
                                onChange={handleNavigator}>
                                {
                                    (DiscussionsSidebarItems && (Object.keys(DiscussionsSidebarItems).length > 0)) && 
                                    Object.keys(DiscussionsSidebarItems).map((i, val) => <Option key={Object.values(DiscussionsSidebarItems)[val].id} value={(Object.values(DiscussionsSidebarItems)[val].link === '/discussions') ? "all" : Object.values(DiscussionsSidebarItems)[val].link}>
                                        <Text type="span"><FontAwesomeIcon icon={Object.values(DiscussionsSidebarItems)[val].icon} className="fa-fw me-2" />{Object.values(DiscussionsSidebarItems)[val].section}</Text>
                                    </Option>)
                                }
                                </Select>
                            </FilterWrapper>
                        }
                            <DiscussionsContentWrapper className="d-flex flex-column flex-lg-row">
                                <Outlet context={{
                                    isAuth: isAuth,
                                    isPostDiscussionVisible: isPostDiscussionVisible,
                                    handleIsPostVisible: handleIsPostVisible,
                                    category: params.slug ? categories[params.slug] : null,
                                }} />
                                <DiscussionsSidebar 
                                className="flex-lg-shrink-0" 
                                isAuth={isAuth} 
                                slug={params.slug}/>
                            </DiscussionsContentWrapper>
                        </DiscussionsBodyWrapper>
                    </Column>
                </Row>
            </DiscussionsWrapper>
        </Section>
    )
}

export default Discussions;