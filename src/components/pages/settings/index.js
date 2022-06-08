import { useEffect, } from "react";
import { Outlet, } from "react-router-dom";
import { useParams, useNavigate, } from "react-router-dom";
import { styled } from "../../../stitches.config";

import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import SettingsSidebar from '../../widgets/SettingsSidebar';


const SettingsWrapper = styled('div', {
    maxWidth: '1700px',
    paddingTop: '$space-5',
});

const SettingsContentWrapper = styled('div', {
    marginTop: '0px',
    transition: '$default',
    '@media screen and (max-width: 575px)': {
        marginTop: '$space-4',
    },
});

export const Settings = ({ 
    isAuth,
    displayPhoto,
    handleDisplayPhoto,
}) => {
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let loading = true;

        if (loading) {
            !(params.slug) && navigate("/settings/information", {replace: true});
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <Section>
            <SettingsWrapper className="mx-auto">
                <Row className="g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-sm-4 col-md-3">
                        <SettingsSidebar />
                    </Column>
                    <Column className="col-sm-8 col-md-9">
                        <SettingsContentWrapper>
                            <Outlet context={{
                                isAuth: isAuth,
                                displayPhoto: displayPhoto,
                                handleDisplayPhoto: handleDisplayPhoto,
                            }}/>
                        </SettingsContentWrapper>
                    </Column>
                </Row>
            </SettingsWrapper>
        </Section>
    )
}

export default Settings;