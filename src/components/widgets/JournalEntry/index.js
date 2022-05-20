import { useState, useEffect, useRef, } from "react";
import { useParams, useOutletContext, } from "react-router-dom";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import TipTapEditor from "../TipTapEditor";
import { RenderHtml, } from "../TipTapEditor";
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";

const JournalEntryWrapper = styled('div', {});

export const JournalEntry = () => {
    const params = useParams();
    const context = useOutletContext();
    const ref = useRef('');
    console.log(context);

    const [values, setValues] = useState('');
    const [output, setOutput] = useState('');
    const [html, setHtml] = useState('');
    const [isEditable, setIsEditable] = useState(false);

    const handleValues = values => setValues(values);
    const handleToggleEdit = () => setIsEditable(!isEditable);
    const handleHtml = html => setHtml(html);
    const handleOutput = output => setOutput(output);

    console.log('output ', output);
    const limit = 10000;

    const getJournalEntry = () => {
        if (context.isAuth) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            axiosInstance.get(process.env.REACT_APP_BASE_URL + "journal-entries/user/get-entry", {
                params: {
                    username: JSON.parse(Cookies.get('auth_user')).username,
                    slug: params.slug,
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleValues({...response.data.data.details, body: JSON.parse(response.data.data.details.body)});
                } else {
                    console.log(response.data.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err profile journal', err.response.data.errors);
                }
            });
        } else {
            console.log('on journal entry: no cookies');
        }
    }

    useEffect(() => {
        let loading = true;

        if (loading) {
            getJournalEntry();
        }

        return () => {
            loading = false;
        }
    }, []);

    console.log('isEditable parent ', isEditable);

    return (
        context.isJournalShown && 
        <JournalEntryWrapper>
            <Button type="button" text="Toggle edit" onClick={() => handleToggleEdit()}/>
        {
            (values && values.body) &&
            <TipTapEditor
            isEditable={isEditable}
            handleOutput={handleOutput}
            limit={limit}
            content={values.body} />
        }
        </JournalEntryWrapper>
    )
}

export default JournalEntry;