import { useState, useEffect, } from "react";
import { axiosInstance } from "../../../requests";
import { useParams, Navigate, } from "react-router-dom";
import { styled } from "../../../stitches.config";
import Section from "../../core/Section";
import Row from "../../core/Row";
import Column from "../../core/Column";
import Button from "../../core/Button";
import {Register as RegisterWidget} from "../../widgets/Register";

import NotFound from "../../widgets/NotFound";

const RegisterWrapper = styled('div', {});

const RegisterBodyWrapper = styled('div', {});

const ActionWrapper = styled('div', {});

export const Register = ({ isAuth, handleLogIn, }) => {
    const params = useParams();

    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleValidToken = () => setIsTokenValid(true);
    const handleInvalidToken = () => setIsTokenValid(false);
    const handleAuthUser = () => setIsAuthenticated(true);
    const handleGuest = () => setIsAuthenticated(false);

    const validateToken = () => {
        axiosInstance.get(process.env.REACT_APP_BASE_URL + "validate-invitation/" + params.token)

        .then(response => {
            if (response.data.isSuccess) {
                handleValidToken();
            } else {
                handleInvalidToken();
            }
        })

        .catch(err => {
            console.log('err ', err.response ? err.response.data.errors : err)
        });
    }

    useEffect(() => {
        let loading = true;

        if (loading) {
            isAuth ? handleAuthUser() : handleGuest();
            validateToken();
        }

        return () => {
            loading = false;
        }
    }, []);

    return (
        <Section>
            <RegisterWrapper>
                <Row className="g-0 m-0" css={{ padding: '$space-3', }}>
                    <Column className="col-12">
                        <RegisterBodyWrapper className="d-flex flex-column">
                        {
                            (!(isAuthenticated) && isTokenValid) ? 
                            <RegisterWidget isAuth={isAuth} handleLogIn={handleLogIn} /> : 
                            (isAuthenticated) ? <Navigate to="/home" replace={true} /> : <NotFound />
                        }
                        </RegisterBodyWrapper>
                    </Column>
                </Row>
            </RegisterWrapper>
        </Section>
    )
}

export default Register;