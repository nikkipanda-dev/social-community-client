import { styled } from "../../../stitches.config";

const NotFoundWrapper = styled('div', {});

export const NotFound = ({ className, css, name }) => {
    return (
        <NotFoundWrapper className={className} css={{ ...css }}>
            Component {name} has not been created yet.
        </NotFoundWrapper>
    )
}

export default NotFound;