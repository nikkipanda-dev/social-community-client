import { useState, } from 'react';
import Cookies from 'js-cookie';
import { message, } from 'antd';
import { axiosInstance } from '../../../requests';
import { isAuth, key, showAlert, } from "../../../util";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleInfo, } from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Alert from '../../core/Alert';
import Text from "../../core/Text";
import Button from "../../core/Button";

const DeleteMicroblogEntryWrapper = styled('div', {});

const SubmitButtonWrapper = styled('div', {
    marginTop: '30px',
});

export const DeleteMicroblogEntry = ({ 
    values, 
    handleHideModal,
    removeEntry,
}) => {
    const [help, setHelp] = useState('');

    const handleDeletedEntry = () => removeEntry();

    const deletePost = () => {
        const microblogForm = new FormData();

        if (isAuth() && (values && values.slug)) {
            const authToken = JSON.parse(Cookies.get('auth_user_token'));

            microblogForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            microblogForm.append('slug', values.slug);

            axiosInstance.post(process.env.REACT_APP_BASE_URL + "microblog-entries/user/entry/destroy", microblogForm, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    handleDeletedEntry();
                    showAlert();
                    handleHideModal();
                    setTimeout(() => {
                        message.open({
                            content: <>
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="me-2"
                                    style={{ color: '#007B70', }} />
                                <Text type="span">Deleted.</Text>
                            </>,
                            key,
                            duration: 2,
                            style: {
                                marginTop: '25vh',
                                zIndex: '999999',
                            }
                        });
                    }, 1000);
                } else {
                    showAlert();
                    setTimeout(() => {
                        message.open({
                            content: <><Text type="span"><FontAwesomeIcon
                                icon={faCircleInfo}
                                className="me-2"
                                style={{ color: '#666666', }} /> {response.data.data.errorText}</Text></>,
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
                if (err.response && err.response.data.errors && err.response.data.errors.slug) {
                    setHelp(<Text type="span" color="red">Something went wrong.</Text>);
                }
            });
        } else {
            console.log('on delete microblog: no cookies');
        }
    }

    return (
        <DeleteMicroblogEntryWrapper>
            <Alert status="warning" icon header="Confirmation">
                <Text type="paragraph">Delete microblog post?</Text>
            </Alert>
            <SubmitButtonWrapper className="d-flex justify-content-md-end align-items-center">
                <Button 
                type="button" 
                text="Delete"
                color="red"
                onClick={() => deletePost()} />
            </SubmitButtonWrapper>
        </DeleteMicroblogEntryWrapper>
    )
}

export default DeleteMicroblogEntry;