import { styled } from "../../../stitches.config";

const ColumnWrapper = styled('div', {});

export const Column = ({ className, css, children }) => {
    return (
        <ColumnWrapper className={className} css={{ ...css }}>
            {children}
        </ColumnWrapper>
    )
}

export default Column;