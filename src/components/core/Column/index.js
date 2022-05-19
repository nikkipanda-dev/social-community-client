import React, { forwardRef } from "react";
import { styled } from "../../../stitches.config";

const ColumnWrapper = styled('div', {});

export const Column = forwardRef(({ className, css, children }, ref) => {
    return (
        <ColumnWrapper 
        ref={ref}
        className={className} 
        css={{ ...css }}>
            {children}
        </ColumnWrapper>
    )
});

export default Column;