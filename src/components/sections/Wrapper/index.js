import { 
    useState, 
    useEffect,
} from "react";
import { Navigate, } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree, } from "@fortawesome/free-solid-svg-icons";
import { styled } from "../../../stitches.config";

const Wrapper = styled('div', {});

const SpinnerWrapper = styled('div', {
    width: '100%',
    height: '100vh',
});

export const AuthWrapper = ({ children, isAuth, }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleHideLoading = () => setIsLoading(false);

    useEffect(() => {
        let loading = true;

        if (loading) {
            setTimeout(() => {
                handleHideLoading();
            }, 500);
        }

        return () => {
            loading = false;
        }
    }, [isAuth]);
    
    return (
        <Wrapper>
        {
            isLoading ? 
            <SpinnerWrapper className="d-flex justify-content-center align-items-center">
                <FontAwesomeIcon 
                icon={faTree} 
                className="fa-4x fa-fade" 
                style={{ color: '#007B70', }} />
            </SpinnerWrapper> : 
            isAuth ? children : <Navigate to="/" replace={true} />
        }
        </Wrapper>
    )
}
