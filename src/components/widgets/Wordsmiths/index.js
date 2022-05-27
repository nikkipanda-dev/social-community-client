import { useState, useEffect, } from "react";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { styled } from "../../../stitches.config";

import Wordsmith from "../Wordsmith";
import Text from "../../core/Text";

const WordsmithsWrapper = styled('div', {});

const WordsmithGroupWrapper = styled('div', {
    marginTop: '$space-3',
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

export const Wordsmiths = ({ isAuth, }) => {
    const [users, setUsers] = useState('');

    const handleUsers = users => setUsers(users);

    useEffect(() => {
        let loading = true;

        if (!(isAuth)) {
            console.error("on get wordsmiths: no cookies");
            return;
        }

        if (loading) {
            getUsers().then(response => {
                console.info('res ', response.data);
                if (!(response.data.isSuccess)) {
                    console.error("err get res ", response.data.data.errorText);
                    return;
                }

                handleUsers(response.data.data.details);
            })

            .catch(err => {
                console.error('err ', err.response && err.response.data.errors);
            });
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <WordsmithsWrapper>
            <Text type="span" size="large">Wordsmiths</Text>
            <WordsmithGroupWrapper>
            {
                (users && (Object.keys(users).length > 0)) &&
                Object.keys(users).map((_, val) => <Wordsmith key={Object.values(users)[val].username} values={Object.values(users)[val]} />)
            }
            </WordsmithGroupWrapper>
        </WordsmithsWrapper>
    )
}

async function getUsers() {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "blog-entries/wordsmiths/get", {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default Wordsmiths;