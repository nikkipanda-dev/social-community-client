import { useState, useEffect, } from 'react';
import { key, showAlert, } from '../../../util';
import Cookies from 'js-cookie';
import { Form, message, } from 'antd';
import { axiosInstance } from '../../../requests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faInfoCircle, } from "@fortawesome/free-solid-svg-icons";
import { styled } from "../../../stitches.config";

import Card from '../../core/Card';
import Heading from '../../core/Heading';
import Text from '../../core/Text';
import Button from '../../core/Button';
import SettingsCallout from '../SettingsCallout';

const SettingsProfileWrapper = styled('div', {
    background: '$lightGray',
    boxSizing: 'border-box',
    '> div': {
        background: 'none',
    },
    '.ant-col:nth-child(n+2)': {
        marginTop: '$space-3',
    },
    '.ant-col > label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '$space-4',
        fontSize: '$default',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper > input, div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper, div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused': {
        outline: 'unset',
        boxShadow: 'unset !important',
        border: 'unset',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper': {
        border: '1px solid $lightGray1 !important',
        padding: '$space-2',
    },
    'div.ant-form-item-control-input > div.ant-form-item-control-input-content > span.ant-input-affix-wrapper-focused': {
        border: '1px solid $lightGray2 !important',
    },
});

const SettingsBodyWrapper = styled('div', {});

const HeaderWrapper = styled('div', {
    marginBottom: '$space-4',
});

export const SettingsProfile = ({ isAuth, }) => {
    const [calloutForm] = Form.useForm();

    const [callout, setCallout] = useState('');
    const [calloutHelp, setCalloutHelp] = useState('');
    const [isCalloutFormShown, setIsCalloutFormShown] = useState(false);

    const handleCallout = callout => setCallout(callout);
    const handleCalloutHelp = calloutHelp => setCalloutHelp(calloutHelp);

    const handleToggleCalloutForm = () => {
        setIsCalloutFormShown(!(isCalloutFormShown));
        calloutForm.resetFields();
    };

    const resetForm = form => {
        form.resetFields();
    }

    const onCalloutUpdate = values => {
        if (!(isAuth)) {
            console.error("on callout update: no cookies");
            return;
        }

        const updateForm = new FormData();
        updateForm.append('username', JSON.parse(Cookies.get('auth_user')).username);

        for (let i in values) {
            values[i] && updateForm.append(i, values[i]);
        }

        for (let [i, val] of updateForm.entries()) {
            console.info('i ', i);
            console.info('val ', val);
        }

        updateCallout(updateForm).then(response => {
            showAlert();

            setTimeout(() => {
                resetForm(calloutForm);
                handleToggleCalloutForm();
            }, 1000);

            if (!(response.data.isSuccess)) {
                message.open({
                    content: <Text type="span"><FontAwesomeIcon icon={faInfoCircle} className="fa-fw fa-xl me-2" />{response.data.data.errorText}</Text>,
                    key,
                    style: {
                        marginTop: '25vh',
                        zIndex: '99999999',
                    },
                });
                return;
            }

            console.info(response.data);

            response.data.isSuccess && message.open({
                content: <Text type="span"><FontAwesomeIcon icon={faCheckCircle} className="fa-fw fa-xl me-2" style={{ color: '#007B70', }} />Updated.</Text>,
                key,
                style: {
                    marginTop: '25vh',
                    zIndex: '99999999',
                },
            });

            response.data.isSuccess && handleCallout(response.data.data.details);
        })

        .catch(err => {
            if (err.response && err.response.data.errors && err.response.data.errors.callout) {
                handleCalloutHelp(<Text type="span" color="red">{err.response.data.errors.callout[0]}</Text>);
            }
        });
    }

    useEffect(() => {
        let loading = true;

        if (loading && isAuth) {
            getCallout().then(response => {
                if (!(response.data.isSuccess)) {
                    handleCallout("No callout yet.");
                    return;
                }

                response.data.isSuccess && handleCallout(response.data.data.details);
            })

            .catch(err => {
                console.error('err get ', err.response && err.response.data.errors);
            });
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <SettingsProfileWrapper>
            <Card>
                <SettingsBodyWrapper>
                    <HeaderWrapper className="d-flex flex-wrap justify-content-between align-items-center">
                        <Heading type={6} text="Callout" />
                        <Button
                        type="button"
                        text={isCalloutFormShown ? "Cancel" : "Update"}
                        color={isCalloutFormShown ? '' : "orange"}
                        onClick={() => handleToggleCalloutForm()} />
                    </HeaderWrapper>
                    <Text type="span" css={{ 
                        padding: '$space-4', 
                        margin: '0px $space-4',
                        background: '$lightGray1',
                        border: '$lightGray2',
                        borderWidth: '5px',
                        borderStyle: 'none none none solid',
                        borderRadius: '0px $small $small 0px',
                    }}>{callout}</Text>
                {
                    isCalloutFormShown && 
                    <SettingsCallout
                    updateFn={onCalloutUpdate}
                    css={{ marginTop: '$space-5', }}
                    form={calloutForm}
                    calloutHelp={calloutHelp} />
                }
                </SettingsBodyWrapper>
            </Card>
        </SettingsProfileWrapper>
    )
}

async function getCallout(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "user/callout/get", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function updateCallout(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "user/callout/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default SettingsProfile;