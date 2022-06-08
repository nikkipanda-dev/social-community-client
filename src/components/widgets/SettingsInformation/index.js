import { Form, message, } from "antd";
import { 
    useState, 
    useEffect,
    useRef,
} from "react";
import Cookies from 'js-cookie';
import { axiosInstance } from "../../../requests";
import { key, showAlert, } from "../../../util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faInfoCircle, } from "@fortawesome/free-solid-svg-icons";
import { styled } from "../../../stitches.config";

import Heading from "../../core/Heading";
import Image from "../../core/Image";
import Text from "../../core/Text";
import Button from "../../core/Button";
import SettingsName from "../SettingsName";
import SettingsEmail from "../SettingsEmail";
import SettingsDisplayPhoto from "../SettingsDisplayPhoto";
import SettingsPassword from "../SettingsPassword";
import Card from "../../core/Card";

const SettingsInfoWrapper = styled('div', {
    background: '$lightGray',
    '> div': {
        background: 'none',
    },
    '> div:nth-child(n+2)': {
        marginTop: '$space-5',
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

const SettingsContentWrapper = styled('div', {});

const HeaderWrapper = styled('div', {});

export const SettingsInformation = ({ 
    isAuth,
    displayPhoto,
    handleDisplayPhoto,
}) => {
    const imageRef = useRef('');

    const [nameForm] = Form.useForm();
    const [emailForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [isNameFormShown, setIsNameFormShown] = useState(false);
    const [isEmailFormShown, setIsEmailFormShown] = useState(false);
    const [isUpdateDisplayPhoto, setIsUpdateDisplayPhoto] = useState(false);
    const [isPasswordFormShown, setIsPasswordFormShown] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const [user, setUser] = useState('');
    const [files, setFiles] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [firstNameHelp, setFirstNameHelp] = useState('');
    const [lastNameHelp, setLastNameHelp] = useState('');
    const [emailHelp, setEmailHelp] = useState('');
    const [passwordHelp, setPasswordHelp] = useState('');
    const [imageHelp, setImageHelp] = useState('');

    const handleToggleNameForm = () => setIsNameFormShown(!(isNameFormShown));
    const handleToggleEmailForm = () => setIsEmailFormShown(!(isEmailFormShown));
    const handleTogglePasswordForm = () => setIsPasswordFormShown(!(isPasswordFormShown));
    const handleForceRender = () => setForceRender(!(forceRender));
    const handleImageUrls = imageUrls => setImageUrls(imageUrls);
    const handleFiles = files => setFiles(files);
    const handleUser = user => setUser(user);
    const handleFirstNameHelp = firstNameHelp => setFirstNameHelp(firstNameHelp);
    const handleLastNameHelp = lastNameHelp => setLastNameHelp(lastNameHelp);
    const handleEmailHelp = emailHelp => setEmailHelp(emailHelp);
    const handlePasswordHelp = passwordHelp => setPasswordHelp(passwordHelp);
    const handleImageHelp = imageHelp => setImageHelp(imageHelp);

    const handleToggleUpdatePhoto = () => {
        handleFiles('');
        handleImageUrls('');
        setIsUpdateDisplayPhoto(!(isUpdateDisplayPhoto));
        if (imageRef.current && imageRef.current.value) {
            imageRef.current.value = '';
        }
    }

    const resetForm = form => {
        form.resetFields();
    }

    const handleImageChange = () => {
        if (imageRef.current.files.length > 0) {
            for (let i of imageRef.current.files) {
                if (i.size > (2 * 1024 * 1024)) {
                    console.log("too large ");
                    return;
                }
            }

            handleFiles(imageRef.current.files);
            handleForceRender();
        }
    }

    const handleRemoveImage = name => {
        handleFiles(Object.values(files).filter(file => file.name !== name));
        handleImageUrls(Object.values(imageUrls).filter(imageUrl => imageUrl.name !== name));
        imageRef.current.value = '';
    }

    const onNameUpdate = values => {
        if (!(isAuth)) {
            console.error("on name update: no cookies");
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

        updateName(updateForm).then(response => {
            showAlert();

            setTimeout(() => {
                resetForm(nameForm);
                handleToggleNameForm();
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

            response.data.isSuccess && Cookies.set('auth_user', JSON.stringify({
                ...JSON.parse(Cookies.get('auth_user')), 
                first_name: response.data.data.details.first_name,
                last_name: response.data.data.details.last_name,
            }), {
                expires: .5,
                secure: true,
                sameSite: 'strict',
            }) && handleUser({ 
                ...user, 
                first_name: response.data.data.details.first_name, 
                last_name: response.data.data.details.last_name
            });
        })

        .catch(err => {
            if (err.response && err.response.data.errors) {
                err.response.data.errors.first_name && handleFirstNameHelp(<Text type="span" color="red">{err.response.data.errors.first_name[0]}</Text>);
                err.response.data.errors.last_name && handleLastNameHelp(<Text type="span" color="red">{err.response.data.errors.last_name[0]}</Text>);
            }
        });
    }

    const onEmailUpdate = value => {
        if (!(isAuth)) {
            console.error("on email update: no cookies");
            return;
        }

        const updateForm = new FormData();
        updateForm.append('username', JSON.parse(Cookies.get('auth_user')).username);
        
        for (let i in value) {
            value[i] && updateForm.append(i, value[i]);
        }

        updateEmail(updateForm).then(response => {
            showAlert();

            setTimeout(() => {
                resetForm(emailForm);
                handleToggleEmailForm();
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

            response.data.isSuccess && message.open({
                content: <Text type="span"><FontAwesomeIcon icon={faCheckCircle} className="fa-fw fa-xl me-2" style={{ color: '#007B70', }} />Updated.</Text>,
                key,
                style: {
                    marginTop: '25vh',
                    zIndex: '99999999',
                },
            });

            response.data.isSuccess && Cookies.set('auth_user', JSON.stringify({
                ...JSON.parse(Cookies.get('auth_user')),
                email: response.data.data.details,
            }), {
                expires: .5,
                secure: true,
                sameSite: 'strict',
            }) && handleUser({
                ...user,
                email: response.data.data.details,
            });
        })

        .catch (err => {
            if (err.response && err.response.data.errors && err.response.data.errors.email) {
                handleEmailHelp(<Text type="span" color="red">{err.response.data.errors.email[0]}</Text>)
            }
        });
    }

    const onUpdateDisplayPhoto = () => {
        handleImageHelp('');

        if (!(isAuth)) {
            console.error("on dp update: no cookies");
            return;
        }

        if (!(files)) {
            console.error("on dp update: no image selected");
            handleImageHelp(<Text type="span" color="red">No image selected.</Text>);
            return;
        }

        const updateForm = new FormData();
        updateForm.append('username', JSON.parse(Cookies.get('auth_user')).username);

        if (files && (Object.keys(files).length > 0)) {
            updateForm.append('image', files[0]);
        }

        updateDisplayPhoto(updateForm).then(response => {
            console.info('res ', response.data);
            showAlert();

            setTimeout(() => {
                handleToggleUpdatePhoto();
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

            response.data.data.details && Cookies.set('auth_user_display_photo', JSON.stringify(response.data.data.details), {
                expires: .5,
                secure: true,
                sameSite: 'strict',
            }) && handleDisplayPhoto(response.data.data.details);

            response.data.isSuccess && message.open({
                content: <Text type="span"><FontAwesomeIcon icon={faCheckCircle} className="fa-fw fa-xl me-2" style={{ color: '#007B70', }} />Updated.</Text>,
                key,
                style: {
                    marginTop: '25vh',
                    zIndex: '99999999',
                },
            });
        })

        .catch(err => {
            if (err.response && err.response.data.errors && err.response.data.errors.image) {
                handleImageHelp(<Text type="span" color="red">{err.response.data.errors.image[0]}</Text>);
            }
        });
    }

    const onPasswordUpdate = value => {
        if (!(isAuth)) {
            console.error("on pw update: no cookies");
            return;
        }

        const updateForm = new FormData();
        updateForm.append('username', JSON.parse(Cookies.get('auth_user')).username);

        for (let i in value) {
            value[i] && updateForm.append(i, value[i]);
        }

        updatePassword(updateForm).then(response => {
            showAlert();

            setTimeout(() => {
                resetForm(passwordForm);
                handleTogglePasswordForm();
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

            response.data.isSuccess && message.open({
                content: <Text type="span"><FontAwesomeIcon icon={faCheckCircle} className="fa-fw fa-xl me-2" style={{ color: '#007B70', }} />Updated.</Text>,
                key,
                style: {
                    marginTop: '25vh',
                    zIndex: '99999999',
                },
            });
        })

        .catch(err => {
            if (err.response && err.response.data.errors && err.response.data.errors.password) {
                handlePasswordHelp(<Text type="span" color="red">{err.response.data.errors.password[0]}</Text>);
            }
        });
    }

    useEffect(() => {
        let loading = true;

        if (loading && isAuth) {
            handleUser(JSON.parse(Cookies.get('auth_user')));
        }

        return () => {
            loading = false;
        }
    }, []);

    useEffect(() => {
        let loading = true;
        let array = [];

        if (loading && (Object.keys(files).length > 0)) {
            for (let i of files) {
                console.log(i);
                array.push({ src: URL.createObjectURL(i), name: i.name });
            }

            console.log('arra ', array);
            handleImageUrls(array);
        }

        return () => {
            if (array.length > 0) {
                for (let i of array) {
                    URL.revokeObjectURL(i);
                }
            }

            loading = false;
        }
    }, [forceRender]);

    return (
        <SettingsInfoWrapper className="d-flex flex-column">
            <Card>
                <SettingsBodyWrapper>
                    <HeaderWrapper className="d-flex flex-wrap justify-content-between align-items-center">
                        <Heading type={6} text="Name" />
                        <Button
                        type="button"
                        text={isNameFormShown ? "Cancel" : "Update"}
                        color={isNameFormShown ? '' : "orange"}
                        onClick={() => handleToggleNameForm()} />
                    </HeaderWrapper>
                    <SettingsContentWrapper>
                        <Text type="span">{user && user.first_name} {user && user.last_name}</Text>
                        {
                            isNameFormShown &&
                            <SettingsName
                            css={{ marginTop: '$space-4' }}
                            updateFn={onNameUpdate}
                            firstNameHelp={firstNameHelp}
                            lastNameHelp={lastNameHelp}
                            form={nameForm} />
                        }
                    </SettingsContentWrapper>
                </SettingsBodyWrapper>
            </Card>
            <Card>
                <SettingsBodyWrapper>
                    <HeaderWrapper className="d-flex flex-wrap justify-content-between align-items-center">
                        <Heading type={6} text="Email Address" />
                        <Button
                        type="button"
                        text={isEmailFormShown ? "Cancel" : "Update"}
                        color={isEmailFormShown ? '' : "orange"}
                        onClick={() => handleToggleEmailForm()} />
                    </HeaderWrapper>
                    <SettingsContentWrapper>
                        <Text type="span">{user && user.email}</Text>
                    {
                        isEmailFormShown &&
                        <SettingsEmail 
                        css={{ marginTop: '$space-4' }}
                        updateFn={onEmailUpdate}
                        emailHelp={emailHelp} 
                        form={emailForm} />
                    }
                    </SettingsContentWrapper>
                </SettingsBodyWrapper>
            </Card>
            <Card>
                <SettingsBodyWrapper>
                    <HeaderWrapper className="d-flex flex-wrap justify-content-between align-items-center">
                        <Heading type={6} text="Display Photo" />
                        <Button
                        type="button"
                        text={isUpdateDisplayPhoto ? "Cancel" : "Update"}
                        color={isUpdateDisplayPhoto ? '' : "orange"}
                        onClick={() => handleToggleUpdatePhoto()} />
                    </HeaderWrapper>
                    <SettingsContentWrapper className="d-flex flex-column">
                    {
                        (!(isUpdateDisplayPhoto) && displayPhoto) && 
                        <Image src={displayPhoto} className="mx-auto" css={{
                            width: '300px',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '$default',
                        }}/>
                    }
                    {
                        (!(isUpdateDisplayPhoto) && !(displayPhoto)) &&
                        <Text 
                        type="span" 
                        className="mx-auto"
                        css={{ marginTop: '$space-4', }}>No photo yet.</Text>
                    }
                    {
                        isUpdateDisplayPhoto &&
                        <SettingsDisplayPhoto
                        ref={imageRef}
                        css={{ width: 'inherit', }}
                        imageHelp={imageHelp}
                        handleImageChange={handleImageChange}
                        handleRemoveImage={handleRemoveImage}
                        updateFn={onUpdateDisplayPhoto}
                        imageUrls={imageUrls} />
                    }
                    </SettingsContentWrapper>
                </SettingsBodyWrapper>
            </Card>
            <Card>
                <SettingsBodyWrapper>
                    <HeaderWrapper className="d-flex flex-wrap justify-content-between align-items-center">
                        <Heading type={6} text="Password" />
                        <Button
                        type="button"
                        text={isPasswordFormShown ? "Cancel" : "Update"}
                        color={isPasswordFormShown ? '' : "orange"}
                        onClick={() => handleTogglePasswordForm()} />
                    </HeaderWrapper>
                    <SettingsContentWrapper>
                    {
                        isPasswordFormShown &&
                        <SettingsPassword 
                        css={{ marginTop: '$space-4' }}
                        updateFn={onPasswordUpdate}
                        passwordHelp={passwordHelp}
                        form={passwordForm} />
                    }
                    </SettingsContentWrapper>
                </SettingsBodyWrapper>
            </Card>
        </SettingsInfoWrapper>
    )
}

async function updateName(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "user/name/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function updateEmail(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "user/email/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function updateDisplayPhoto(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "user/display-photo/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

async function updatePassword(form) {
    const authToken = JSON.parse(Cookies.get('auth_user_token'));

    return axiosInstance.post(process.env.REACT_APP_BASE_URL + "user/password/update", form, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })
}

export default SettingsInformation;