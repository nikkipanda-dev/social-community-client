import { forwardRef, } from "react";
import { styled } from "../../../stitches.config";

import NotFound from '../../widgets/NotFound';

const textStyle = {
    fontFamily: '$manjari',
    fontSize: '$small',
    letterSpacing: '$default',
    wordSpacing: '.5px',
    variants: {
        color: {
            darkGray: {
                color: '$darkGray',
            },
            lightGray2: {
                color: '$lightGray2',
            },
            brown: {
                color: '$sealBrown',
            },
            orange: {
                color: '$orangePeel',
            },
            red: {
                color: '$orangeRedCrayola',
            },
            green: {
                color: '$pineGreen',
            },
        },
        size: {
            tiny: {
                fontSize: '$tiny',
            },
            medium: {
                fontSize: '$medium',
            },
            large: {
                fontSize: '$large',
            },
        },
    }
};

const ParagraphWrapper = styled('p',
    textStyle,
    {
        textAlign: 'justify',
    },
);

const SpanWrapper = styled('span',
    textStyle,
    {}
);

const textType = {
    paragraph: ParagraphWrapper,
    span: SpanWrapper,
}

export const Text = forwardRef(({
    type,
    className,
    css,
    as,
    color,
    size,
    onClick,
    evtOnclick,
    children,
}, ref) => {
    const TextWrapper = textType[type];

    return (
        TextWrapper ?
            <TextWrapper
                {...color && { color: color }}
                {...as && { as: as }}
                {...size && { size: size }}
                {...onClick && { onClick: () => onClick() }}
                {...evtOnclick && { onClick: evt => evtOnclick(evt) }}
                className={className}
                {...css && { css: { ...css } }}>
                {children}
            </TextWrapper> : <NotFound />
    )
});

export default Text;
