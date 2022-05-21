import { styled } from "../../../stitches.config";

import JournalEntryCard from "../JournalEntryCard";

const JournalEntriesWrapper = styled('div', {
    '> div:nth-child(n+2)': {
        marginTop: '$space-3',
    },
});

export const JournalEntries = ({ journalEntries, handleJournalEntries, }) => {
    return (
        <JournalEntriesWrapper>
        {
            (journalEntries && (Object.keys(journalEntries).length > 0)) && 
            Object.keys(journalEntries).map((_, val) => {
            return <JournalEntryCard 
            key={Object.values(journalEntries)[val].slug} 
            handleJournalEntries={handleJournalEntries}
            values={Object.values(journalEntries)[val]} />
            })
        }
        </JournalEntriesWrapper>
    )
}

export default JournalEntries;