import { useState, useEffect, } from "react";
import { axiosInstance } from "../../../requests";
import Cookies from 'js-cookie';
import { Form, message, } from "antd";
import { key, showAlert, } from "../../../util";
import { 
    useOutletContext, 
    useParams,
    useNavigate,
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCircleCheck, 
    faCircleInfo,
    faBan,
    faCaretLeft,
    faFlag,
    faTrash,
    faPen,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import Text from "../../core/Text";
import Heading from "../../core/Heading";
import PostEvent from "../PostEvent";
import Button from "../../core/Button";
import Modal from "../Modal";
import Alert from "../../core/Alert";
import EventReplies from "../EventReplies";
import EventParticipants from "../EventParticipants";

const EventWrapper = styled('div', {
    '.ant-col > label.ant-form-item-required': {
        fontFamily: '$manjari',
        marginTop: '$space-2',
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
    'a': {
        textDecoration: 'unset',
        color: '$pineGreen',
    },
    'a:hover': {
        color: '$darkGray',
    },
});

const EventBodyWrapper = styled('div', {
    marginTop: '$space-4',
});

const EventMiscWrapper = styled('div', {});

const MiscWrapper = styled('div', {});

const ActionWrapper = styled('div', {
    marginTop: '0px',
    '> button:nth-child(n+2)': {
        marginLeft: '$space-2',
    },
    '@media screen and (max-width: 575px)': {
        marginTop: '$space-3',
        '> button:nth-child(n+2)': {
            marginLeft: '0px',
        },
    },
});

export const Event = () => {
    const context = useOutletContext();
    const params = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [isVisible, setIsVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [status, setStatus] = useState('')
    const [header, setHeader] = useState('')
    const [help, setHelp] = useState('')
    const [event, setEvent] = useState('');
    const [nameHelp, setNameHelp] = useState('');
    const [bodyHelp, setBodyHelp] = useState('');
    const [startDateHelp, setStartDateHelp] = useState('');
    const [endDateHelp, setEndDateHelp] = useState('');
    const [rsvpDateHelp, setRsvpDateHelp] = useState('');
    const [categoryHelp, setCategoryHelp] = useState('');

    const handleToggleEditor = () => setIsEditable(!(isEditable));
    const handleShowModal = () => setIsVisible(true);
    const handleHideModal = () => setIsVisible(false);
    const handleStatus = status => setStatus(status);
    const handleHeader = header => setHeader(header);
    const handleHelp = help => setHelp(help);
    const handleNameHelp = nameHelp => setNameHelp(nameHelp);
    const handleBodyHelp = bodyHelp => setBodyHelp(bodyHelp);
    const handleRsvpDateHelp = rsvpDateHelp => setRsvpDateHelp(rsvpDateHelp);
    const handleStartDateHelp = startDateHelp => setStartDateHelp(startDateHelp);
    const handleEndDateHelp = endDateHelp => setEndDateHelp(endDateHelp);
    const handleCategoryHelp = categoryHelp => setCategoryHelp(categoryHelp);
    const handleEvent = event => setEvent(event);

    const handleNavigator = () => {
        navigate("/events", { replace: true, });
    }

    const handleConfirmDelete = () => {
        handleStatus('warning');
        handleHeader('Confirmation');
        handleHelp(<Text type="span">You are about to delete this event. Continue?</Text>);
        handleShowModal();
    }

    const onUpdate = values => {
        if (!(context.isAuth)) {
            console.error('err update: no cookies');
            return;
        }

        if (params.slug) {
            const updateForm = new FormData();

            for (let i in values) {
                if (values[i]) {
                    if ((i === 'start_date') || (i === 'end_date') || (i === 'rsvp_date')) {
                        console.log('date ', new Date(values[i]._d));
                        const month = new Date(values[i]._d).getMonth() + 1;
                        const year = new Date(values[i]._d).getFullYear();
                        const day = new Date(values[i]._d).getDate();
                        values[i]._d && updateForm.append(i, [year, month, day].join("-"));
                    } else if ((i === 'start_date_time') || (i === 'end_date_time')) {
                        console.log('time ', new Date(values[i]._d));
                        let hours = new Date(values[i]._d).getHours();
                        hours = ((hours < 10) ? "0" : '') + hours;
                        let minutes = new Date(values[i]._d).getMinutes();
                        minutes = ((minutes < 10) ? "0" : '') + minutes;
                        values[i]._d && updateForm.append(i, [hours, minutes, "00"].join(":"));
                    } else {
                        updateForm.append(i, values[i]);
                    }
                }
            }

            updateForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            updateForm.append('slug', params.slug);

            for (let [i, val] of updateForm.entries()) {
                console.info('i ', i);
                console.info('val ', val);
            }

            updateEvent(updateForm).then(response => {
                console.info('res ', response.data);
                showAlert();

                if (!(response.data.isSuccess)) {
                    message.open({
                        content: <Text type="span"><FontAwesomeIcon icon={faCircleInfo} className="fa-fw me-2" />{response.data.data.errorText}</Text>,
                        key,
                        style: {
                            marginTop: '25vh',
                            zIndex: '99999999',
                        },
                    });
                    return;
                }

                handleEvent(response.data.data.details);
                message.open({
                    content: <Text type="span"><FontAwesomeIcon icon={faCircleCheck} className="fa-fw me-2" style={{ color: '#007B70', }} />Updated. Redirecting...</Text>,
                    key,
                    style: {
                        marginTop: '25vh',
                        zIndex: '99999999',
                    },
                });

                setTimeout(() => {
                    navigate("/events", { replace: true, })
                }, 1000);
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    err.response.data.errors.name && handleNameHelp(<Text type="span" color="red">{err.response.data.errors.name[0]}</Text>);
                    err.response.data.errors.body && handleBodyHelp(<Text type="span" color="red">{err.response.data.errors.body[0]}</Text>);
                    err.response.data.errors.start_date && handleStartDateHelp(<Text type="span" color="red">{err.response.data.errors.start_date[0]}</Text>);
                    err.response.data.errors.end_date && handleEndDateHelp(<Text type="span" color="red">{err.response.data.errors.end_date[0]}</Text>);
                    err.response.data.errors.rsvp_date && handleRsvpDateHelp(<Text type="span" color="red">{err.response.data.errors.rsvp_date[0]}</Text>);
                    err.response.data.errors.category && handleCategoryHelp(<Text type="span" color="red">{err.response.data.errors.category[0]}</Text>);
                }
            });
        }
    }

    const onRemove = () => {
        if (!(context.isAuth)) {
            console.error('err remove: no cookies');
            return;
        }

        if (params.slug) {
            const deleteForm = new FormData();

            deleteForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
            deleteForm.append('slug', params.slug);

            destroyEvent(deleteForm).then(response => {
                console.info('res ', response.data);
                showAlert();

                if (!(response.data.isSuccess)) {
                    message.open({
                        content: <Text type="span"><FontAwesomeIcon icon={faCircleInfo} className="fa-fw me-2" />{response.data.data.errorText}</Text>,
                        key,
                        style: {
                            marginTop: '25vh',
                            zIndex: '99999999',
                        },
                    });
                    return;
                }

                handleStatus('success');
                handleHeader('Event deleted');
                handleHelp(<Text type="span">Going back...</Text>);

                setTimeout(() => {
                    navigate("/events", { replace: true, })
                }, 1000);
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    console.log('err delete ', err.response.data.errors);
                }
            });
        }
    }
    
    useEffect(() => {
        let loading = true;

        if (!(context.isAuth)) {
            console.error('on get event: no cookies');
            return;
        }

        if (loading && params.slug) {
            getEvent(params.slug).then(response => {
                console.info('res ', response.data);
                if (!(response.data.isSuccess)) {
                    console.error('err res get: ', response.data.data.errorText);
                    return;
                }

                handleEvent(response.data.data.details);
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
        (event && (Object.keys(event).length > 0)) && 
        <EventWrapper>
            <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center" css={{ width: '100%', }}>
                <Button
                type="button"
                text={<Text type="span"><FontAwesomeIcon icon={faCaretLeft} className="fa-fw me-1" />Back to events</Text>}
                onClick={() => handleNavigator()} />
                <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                    <Button
                    type="button"
                    color={isEditable ? "" : "orange"}
                    className="flex-grow-1 flex-sm-grow-0"
                    text={<Text type="span"><FontAwesomeIcon icon={isEditable ? faBan : faPen} className="fa-fw me-1" />{isEditable ? "Cancel" : "Update"}</Text>}
                    onClick={() => handleToggleEditor()} />
                    <Button
                    type="button"
                    color="red"
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                    text={<Text type="span"><FontAwesomeIcon icon={faTrash} className="fa-fw me-1" />Delete</Text>}
                    onClick={() => handleConfirmDelete()} />
                    <Button
                    type="button"
                    text={<Text type="span"><FontAwesomeIcon icon={faFlag} className="fa-fw me-1" /></Text>}
                    className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0 button-plain-red"
                    color="transparent"
                    onClick={() => handleShowModal()} />
                </ActionWrapper>
            </ActionWrapper>
            <EventBodyWrapper className="d-flex flex-column">
            {
                !(isEditable) && 
                <>
                    <Heading type={5} text={event.name} />
                    <Text type="paragraph">Details: {event.details}</Text>
                </>
            }
            {
                isEditable &&
                <PostEvent
                values={event}
                storeFn={onUpdate}
                form={form}
                nameHelp={nameHelp}
                bodyHelp={bodyHelp}
                startDateHelp={startDateHelp}
                endDateHelp={endDateHelp}
                rsvpDateHelp={rsvpDateHelp}
                categoryHelp={categoryHelp} />
            }
            </EventBodyWrapper>
            <EventMiscWrapper className="d-flex flex-column flex-xl-row">
                <MiscWrapper css={{ flex: '60%', padding: '$space-3', }}>
                    <EventReplies isAuth={context.isAuth} slug={(event && event.slug)} />
                </MiscWrapper>
                <MiscWrapper css={{
                    flex: '40%',
                    background: '$lightGray',
                    borderRadius: '$default',
                    padding: '$space-3',
                }}>
                    <EventParticipants isAuth={context.isAuth} />
                </MiscWrapper>
            </EventMiscWrapper>
            <Modal
            isVisible={isVisible}
            closable={false}
            maskClosable={true}
            onCancel={handleHideModal}>
            {
                help && 
                <Alert
                status={status}
                icon
                header={header}>
                    {help}
                </Alert>
            }
            <ActionWrapper className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center" css={{     marginTop: '$space-3', }}>
                <Button 
                type="button" 
                text="Cancel"
                className="flex-grow-1 flex-sm-grow-0"
                onClick={() => handleHideModal()} />
                <Button
                type="button"
                text="Delete"
                className="flex-grow-1 flex-sm-grow-0 mt-3 mt-sm-0"
                color="red"
                onClick={() => onRemove()} />
            </ActionWrapper>
            </Modal>
        </EventWrapper>
    )
}

async function getEvent(slug) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.get(process.env.REACT_APP_BASE_URL + "events/get", {
        params: {
            username: JSON.parse(Cookies.get('auth_user')).username,
            slug: slug,
        },
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function updateEvent(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "events/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function destroyEvent(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "events/destroy", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default Event;