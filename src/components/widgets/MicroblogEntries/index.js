import { styled } from "../../../stitches.config";

import MicroblogEntry from "../MicroblogEntry";

const MicroblogEntriesWrapper = styled('div', {
    marginTop: '$space-5',
    '> div:nth-child(n+2)': {
        marginTop: '$space-5',
    },
});

export const MicroblogEntries = () => {
    const microblogEntries = [
        {
            id: 1,
            body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam quibusdam facilis provident cumque illum, neque magni rerum maxime dolores, ab tempora eveniet itaque debitis ad quos, quasi minima asperiores rem dolorem quia distinctio eligendi ex perspiciatis ea.",
            created_at: "Jan 1, 2022, 00:00",
            user: {
                id: 1,
                username: "narutouzumaki",
                first_name: "Naruto",
                last_name: "Uzumaki",
            },
        },
        {
            id: 2,
            body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
            created_at: "Jan 1, 2022, 00:00",
            user: {
                id: 2,
                username: "arianagrande",
                first_name: "Ariana",
                last_name: "Grande",
            },
        },
        {
            id: 3,
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus ratione perspiciatis qui enim laborum sunt ex optio! Sint, excepturi ipsa?",
            created_at: "Jan 1, 2022, 00:00",
            user: {
                id: 2,
                username: "arianagrande",
                first_name: "Ariana",
                last_name: "Grande",
            },
        },
        {
            id: 4,
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit?",
            created_at: "Jan 1, 2022, 00:00",
            user: {
                id: 3,
                username: "tomerichsen",
                first_name: "Tom",
                last_name: "Erichsen",
            },
        },
        {
            id: 5,
            body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis, voluptate. Mollitia at fugit quaerat aut, a dolores vero, illo aperiam consequuntur pariatur magni aliquid! At repellat omnis qui tempore tempora!",
            created_at: "Jan 1, 2022, 00:00",
            user: {
                id: 4,
                username: "tyrabanks",
                first_name: "Tyra",
                last_name: "Banks",
            },
        },
        {
            id: 6,
            body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis, voluptate!",
            created_at: "Jan 1, 2022, 00:00",
            user: {
                id: 5,
                username: "mariasantos",
                first_name: "Maria",
                last_name: "Santos",
            },
        },
    ]

    return (
        <MicroblogEntriesWrapper>
        {
            (microblogEntries && (Object.keys(microblogEntries).length > 0)) && 
            Object.keys(microblogEntries).map((i, val) => {
                return <MicroblogEntry key={Object.values(microblogEntries)[val].id} microblogEntry={Object.values(microblogEntries)[val]} />
            })
        }
        </MicroblogEntriesWrapper>
    )
}

export default MicroblogEntries;