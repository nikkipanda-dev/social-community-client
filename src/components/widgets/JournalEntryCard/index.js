import { useState, useEffect, } from "react";
import { Link, useNavigate, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import Card from "../../core/Card";
import Button from "../../core/Button";

const JournalEntryCardWrapper = styled('div', {});

const JournalEntryBodyWrapper = styled('div', {});

const JournalEntryContentWrapper = styled('div', {
    'a': {
        textDecoration: 'unset',
        fontFamily: '$manjari',
        fontSize: '$default',
        color: '$sealBrown',
    },
    'a:hover': {
        color: '$darkGray',
    }, 
});

const SubmitButtonWrapper = styled('div', {
    marginTop: '30px',
});
export const JournalEntryCard = ({ values, handleJournalEntries, }) => {
    const navigate = useNavigate();

    const [journalEntry, setJournalEntry] = useState('');

    const handleJournalEntry = journalEntry => setJournalEntry(journalEntry);

    useEffect(() => {
        let loading = true;

        if (loading && (values && (values.slug && values.title && values.body && values.created_at))) {
            handleJournalEntry({...values, body: JSON.parse(values.body)});
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        journalEntry && (journalEntry.slug && journalEntry.title && journalEntry.body && journalEntry.created_at) && 
        <JournalEntryCardWrapper >
            <Card>
                <JournalEntryBodyWrapper>
                    <JournalEntryContentWrapper>
                    {
                        (journalEntry && journalEntry.title && journalEntry.slug) && 
                        <Link to={"../" + journalEntry.slug}>
                            <Text type="span" size="medium">{journalEntry.title}</Text>
                        </Link>
                    }
                    </JournalEntryContentWrapper>
                    <SubmitButtonWrapper className="d-flex justify-content-md-end align-items-center">
                        <Button
                        type="submit"
                        text="Post"
                        className="flex-grow-1 flex-md-grow-0"
                        color="brown" />
                    </SubmitButtonWrapper>
                </JournalEntryBodyWrapper>
            </Card>
        </JournalEntryCardWrapper>
    )
}

export default JournalEntryCard;