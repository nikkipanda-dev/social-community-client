import { useState, useEffect, } from "react";
import { message, } from "antd";
import { axiosInstance } from "../../../requests";
import { key, showAlert, } from "../../../util";
import { useNavigate, } from "react-router-dom";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Alert from "../../core/Alert";
import Button from "../../core/Button";
import Text from "../../core/Text";

const DeleteJournalEntryWrapper = styled('div', {});

const ActionWrapper = styled('div', {
    marginTop: '$space-3',
});

export const DeleteJournalEntry = ({ 
    isAuth, 
    onCancel, 
    slug,
    title,
}) => {
    const navigate = useNavigate();
    
    const [help, setHelp] = useState(<Text type="paragraph">You are about to delete journal entry <Text type="span">&#x201C;{title}&#x201D;</Text>. Continue?</Text>);
    const [status, setStatus] = useState('warning');

    const handleHelp = help => setHelp(help);
    const handleStatus = status => setStatus(status);

    const removeJournalEntry = () => {
        if (isAuth && slug) {
            const deleteJournalForm = new FormData();

            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            deleteJournalForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            deleteJournalForm.append('slug', slug);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "journal-entries/user/destroy", deleteJournalForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleStatus('success');
                    handleHelp('Deleted. Going back...');
                    setTimeout(() => {
                        navigate('../all');
                    }, 1000);
                } else {
                    showAlert();
                    setTimeout(() => {
                        message.info({
                            content: <Text type="span">{response.data.data.errorText}</Text>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    handleStatus('error');
                    handleHelp(<Text type="span" color="red">{err.response.data.errors.slug[0]}</Text>)
                }
            });
        } else {
            console.log('on delete journal: no cookies');
        }
    }

    return (
        <DeleteJournalEntryWrapper>
        {
            (help && status) && 
            <Alert
            status={status}
            icon
            header="Confirm Deletion">
                {help}
            </Alert>
        }
        <ActionWrapper className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
            <Button 
            type="button" 
            text="Cancel" 
            onClick={() => onCancel()} />
            <Button
            type="button"
            text="Delete"
            color="red"
            onClick={() => removeJournalEntry()} />
        </ActionWrapper>
        </DeleteJournalEntryWrapper>
    )
}

export default DeleteJournalEntry;
