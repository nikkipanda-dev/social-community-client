import { styled } from "../../../stitches.config";

const RowWrapper = styled('div', {});

export const Row = ({
    className,
    css,
    children,
}) => {
    return (
        <RowWrapper className={'row' + (className ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            {children}
        </RowWrapper>
    )
}

export default Row;