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
            brown: {
                color: '$sealBrown',
            },
            orange: {
                color: '$orangePeel',
            },
            red: {
                color: '$orangeRedCrayola',
            }
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

export const Text = ({
    type,
    className,
    css,
    as,
    color,
    size,
    onClick,
    evtOnclick,
    children,
}) => {
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
}

export default Text;
