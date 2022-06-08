import { useEffect, useState, } from "react";
import { 
    useParams, 
    Navigate,
    useOutletContext,
} from "react-router-dom";
import { styled } from "../../../stitches.config";

import SettingsInformation from "../../widgets/SettingsInformation";
import SettingsAlert from "../../widgets/SettingsAlert";
import SettingsAccount from "../../widgets/SettingsAccount";

const SettingsWrapper = styled('div', {
    '> div': {
        padding: '$space-2',
        borderRadius: '$default',
    },
});

export const Settings = () => {
    const params = useParams();
    const context = useOutletContext();

    const [isInfoShown, setIsInfoShown] = useState(false);
    const [isAccountShown, setIsAccountShown] = useState(false);
    const [isAlertShown, setIsAlertShown] = useState(false);

    const handleShowInfo = () => setIsInfoShown(true);
    const handleHideInfo = () => setIsInfoShown(false);
    const handleShowAccount = () => setIsAccountShown(true);
    const handleHideAccount = () => setIsAccountShown(false);
    const handleShowAlert = () => setIsAlertShown(true);
    const handleHideAlert = () => setIsAlertShown(false);

    useEffect(() => {
        let loading = true;

        if (loading && params.slug) {
            handleHideInfo();
            handleHideAccount();
            handleHideAlert();

            if (params.slug === "information") {
                handleShowInfo();
            } 

            if (params.slug === "alerts") {
                handleShowAlert();
            }

            if (params.slug === "account") {
                handleShowAccount();
            }
        }

        return () => {
            loading = false;
        }
    }, [params]);

    return (
        <SettingsWrapper>
        {
            isInfoShown && <SettingsInformation 
            isAuth={context.isAuth} 
            displayPhoto={context.displayPhoto}
            handleDisplayPhoto={context.handleDisplayPhoto} />
        }
        {
            isAlertShown && <SettingsAlert isAuth={context.isAuth} />
        }
        {
            isAccountShown && <SettingsAccount isAuth={context.isAuth} />
        }
        </SettingsWrapper>
    )
}

export default Settings;