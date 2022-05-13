import { useState, useEffect } from "react";
import { styled } from "../../../stitches.config";

import HomeActivities from "../../widgets/HomeActivities";
import HomeUpdates from "../../widgets/HomeUpdates";
import Section from '../../core/Section';
import Row from "../../core/Row";
import Column from "../../core/Column";
import PostMicroblog from '../../widgets/PostMicroblog';
import MicroblogEntries from '../../widgets/MicroblogEntries';

const HomeWrapper = styled('div', {
    maxWidth: '1700px',
});

const HomeMicroblogEntriesWrapper = styled('div', {
    maxWidth: '700px',
});

export const Home = () => {
    const testType = [
        {
            id: 1,
            type: "comment",
            slug: "lorem-ipsum",
            username: "johndoe",
            section: "microblog",
            preview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In, est.",
        },
        {
            id: 2,
            type: "blog",
            slug: "lorem-ipsum",
            username: "janedoe",
            title: "How To Make Lumpia (HTML)",
        },
        {
            id: 3,
            type: "comment",
            slug: "lorem-ipsum",
            username: "jackskellington",
            section: "microblog",
            preview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In, est.",
        },
        {
            id: 4,
            type: "discussion",
            slug: "lorem-ipsum",
            username: "narutouzumaki",
            title: "Movie recos",
        },
        {
            id: 5,
            type: "event",
            slug: "lorem-ipsum",
            username: "lilycollins",
            name: "Reunion 3Q",
            start_date: "Jan 1, 2022, 00:00",
            end_date: "Jan 5, 2022, 00:00",
        },
        {
            id: 6,
            type: "blog",
            slug: "lorem-ipsum",
            username: "johnnydepp",
            title: "My Truth",
        },
    ];

    return (
        <Section>
            <HomeWrapper className="mx-auto" css={{ paddingTop: '$space-5', }}>
                <Row className="m-0 g-0" css={{ padding: '$space-3', }}>
                    <Column className="col">
                        <HomeActivities activities={testType} />
                    </Column>
                    <Column className="col-6">
                        <HomeMicroblogEntriesWrapper className="mx-auto">
                            <PostMicroblog />
                            <MicroblogEntries />
                        </HomeMicroblogEntriesWrapper>
                    </Column>
                    <Column className="col">
                        <HomeUpdates />
                    </Column>
                </Row>
            </HomeWrapper>
        </Section>
    )
}

export default Home;