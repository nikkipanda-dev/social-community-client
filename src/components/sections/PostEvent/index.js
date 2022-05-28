import { useState, useEffect, } from "react";
import { Form, message, } from "antd";
import { useOutletContext, useNavigate, } from "react-router-dom";
import Cookies from "js-cookie";
import { axiosInstance } from "../../../requests";
import { key, showAlert, } from "../../../util";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCircleCheck, 
    faCircleInfo,
    faCaretLeft,
} from '@fortawesome/free-solid-svg-icons';
import { styled } from "../../../stitches.config";

import { PostEvent as Post } from "../../widgets/PostEvent";
import Text from "../../core/Text";
import Button from "../../core/Button";

const PostEventWrapper = styled('div', {});

const ActionWrapper = styled('div', {
    marginBottom: '$space-3',
});

export const PostEvent = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const context = useOutletContext();

    const [nameHelp, setNameHelp] = useState('');
    const [bodyHelp, setBodyHelp] = useState('');
    const [startDateHelp, setStartDateHelp] = useState('');
    const [endDateHelp, setEndDateHelp] = useState('');
    const [rsvpDateHelp, setRsvpDateHelp] = useState('');
    const [categoryHelp, setCategoryHelp] = useState('');

    const handleNameHelp = nameHelp => setNameHelp(nameHelp);
    const handleBodyHelp = bodyHelp => setBodyHelp(bodyHelp);
    const handleRsvpDateHelp = rsvpDateHelp => setRsvpDateHelp(rsvpDateHelp);
    const handleStartDateHelp = startDateHelp => setStartDateHelp(startDateHelp);
    const handleEndDateHelp = endDateHelp => setEndDateHelp(endDateHelp);
    const handleCategoryHelp = categoryHelp => setCategoryHelp(categoryHelp);

    const handleNavigator = () => {
        navigate("/events", { replace: true, })
    }

    const onStoreEvent = values => {
        if (!(context.isAuth)) {
            console.error('err store: no cookies');
            return;
        }

        const storeForm = new FormData();

        for (let i in values) {
            if ((i === 'start_date') || (i === 'end_date') || (i === 'rsvp_date')) {
                console.log('date ', new Date(values[i]._d));
                const month = new Date(values[i]._d).getMonth() + 1;
                const year = new Date(values[i]._d).getFullYear();
                const day = new Date(values[i]._d).getDate();
                values[i]._d && storeForm.append(i, [year, month, day].join("-"));
            } else if ((i === 'start_date_time') || (i === 'end_date_time')) {
                console.log('time ', new Date(values[i]._d));
                let hours = new Date(values[i]._d).getHours();
                hours = ((hours < 10) ? "0" : '') + hours;
                let minutes = new Date(values[i]._d).getMinutes();
                minutes = ((minutes < 10) ? "0" : '') + minutes;
                values[i]._d && storeForm.append(i, [hours, minutes, "00"].join(":"));
            } else {
                values[i] && storeForm.append(i, values[i]);
            }
        }

        storeForm.append('username', JSON.parse(Cookies.get('auth_user')).username);

        for (let [i, val] of storeForm.entries()) {
            console.info('i ', i);
            console.info('val ', val);
        }

        storeEvent(storeForm).then(response => {
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

            message.open({
                content: <Text type="span"><FontAwesomeIcon icon={faCircleCheck} className="fa-fw me-2" style={{ color: '#007B70', }} />Posted. Redirecting...</Text>,
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

    return (
        <PostEventWrapper>
            <ActionWrapper className="d-flex">
                <Button
                type="button"
                className="flex-grow-1 flex-sm-grow-0"
                text={<Text type="span"><FontAwesomeIcon icon={faCaretLeft} className="fa-fw me-1" />Back to events</Text>}
                onClick={() => handleNavigator()} />
            </ActionWrapper>
            <Post 
            storeFn={onStoreEvent} 
            form={form}
            nameHelp={nameHelp}
            bodyHelp={bodyHelp}
            startDateHelp={startDateHelp}
            endDateHelp={endDateHelp}
            rsvpDateHelp={rsvpDateHelp}
            categoryHelp={categoryHelp}/>
        </PostEventWrapper>
    )
}

function storeEvent(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "events/store", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default PostEvent;