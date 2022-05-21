import { useState, useEffect, } from "react";
import { Link, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import Card from "../../core/Card";
import Button from "../../core/Button";

const JournalEntryCardWrapper = styled('div', {});

const JournalEntryBodyWrapper = styled('div', {
    padding: '$space-2',
});

const JournalEntryContentWrapper = styled('div', {
    padding: '$space-2',
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
        <JournalEntryCardWrapper>
            <Card css={{ background: 'transparent', }}>
                <JournalEntryContentWrapper className="d-flex flex-column">
                {
                    (journalEntry && journalEntry.title && journalEntry.slug) && 
                    <Link to={"../" + journalEntry.slug}>
                        <Text type="span" size="medium">{journalEntry.title}</Text>
                    </Link>
                }
                <Text type="span" css={{ display: 'inline-block', color: '$darkGray', }}>
                {
                    journalEntry.created_at &&
                    new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Asia/Manila',
                        hourCycle: 'h12',
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    }).format(new Date(journalEntry.created_at))
                }
                </Text>
                </JournalEntryContentWrapper>
            </Card>
        </JournalEntryCardWrapper>
    )
}

export default JournalEntryCard;