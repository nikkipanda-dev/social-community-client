import { message } from 'antd';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, } from '@fortawesome/free-solid-svg-icons';

import Text from '../components/core/Text';

export const isAuth = () => {
    let isAuth = false;

    if ((Cookies.get('auth_user') && JSON.parse(Cookies.get('auth_user'))) && (Cookies.get('auth_user_token') && JSON.parse(Cookies.get('auth_user_token'))) && (Cookies.get('auth_user_firebase_secret') && JSON.parse(Cookies.get('auth_user_firebase_secret'))) && (Cookies.get('auth_user_firebase') && JSON.parse(Cookies.get('auth_user_firebase')))) {
        isAuth = true;
    }

    return isAuth;
}

export const key = 'updatable';

export const showAlert = () => {
    message.open({
        content: <><FontAwesomeIcon icon={faCircleNotch} className="fa-spin me-2" /><Text type="span" className="fa-xl">Loading...</Text></>,
        key,
        style: {
            marginTop: '25vh',
            zIndex: '99999999',
        },
    });
};