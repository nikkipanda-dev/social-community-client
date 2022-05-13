import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleRoof, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Heading from "../../core/Heading";
import User from "../User";

const RecentMembersWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

export const RecentMembers = () => {

    const members = [
        {
            id: 1,
            username: "arianagrande",
            first_name: "Ariana",
            last_name: "Grande",
        },
        {
            id: 2,
            username: "janedoe",
            first_name: "Jane",
            last_name: "Doe",
        },
        {
            id: 3,
            username: "tomerichsen",
            first_name: "Tom",
            last_name: "Erichsen",
        },
        {
            id: 4,
            username: "tyrabanks",
            first_name: "Tyra",
            last_name: "Banks",
        },
        {
            id: 5,
            username: "petersantos",
            first_name: "Peter",
            last_name: "Santos",
        },
        {
            id: 6,
            username: "narutouzumaki",
            first_name: "Naruto",
            last_name: "Uzumaki",
        },
    ]

    return (
        <RecentMembersWrapper>
            <Heading type={6} text={<><FontAwesomeIcon icon={faPeopleRoof} className="me-3" />Recent Members</>} />
        {
            (members && (Object.keys(members).length > 0)) &&
            Object.keys(members).map((i, val) => {
                return <User 
                key={Object.values(members)[val].id} 
                type="item"
                member={Object.values(members)[val]}
                />
            })
        }
        </RecentMembersWrapper>
    )
}

export default RecentMembers;