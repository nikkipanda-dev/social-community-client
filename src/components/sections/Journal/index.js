import { useState, useEffect, } from 'react';
import { useOutletContext, } from 'react-router-dom';
import Cookies from 'js-cookie';
import { styled } from "../../../stitches.config";

import PostJournal from '../../widgets/PostJournal';
import JournalEntries from '../../widgets/JournalEntries';

const JournalWrapper = styled('div', {});

export const Journal = () => {
    return (
        <JournalWrapper>
            <PostJournal />
            <JournalEntries />
        </JournalWrapper>
    )
}

export default Journal;
