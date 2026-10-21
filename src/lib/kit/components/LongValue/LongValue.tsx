import React from 'react';

import {Text, type TextProps} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './LongValue.scss';

const b = block('long-value');

export interface LongValueProps extends Omit<TextProps, 'children'> {
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    value?: string | number | boolean;
}

export const LongValue: React.FC<LongValueProps> = ({
    className,
    color,
    onClick,
    value,
    ...restProps
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const openRef = React.useRef(false);
    const [open, setOpen] = React.useState(false);
    const [long, setLong] = React.useState(false);

    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            onClick?.(event);
            setOpen((current) => {
                openRef.current = !current;

                return !current;
            });
        },
        [onClick],
    );

    React.useLayoutEffect(() => {
        const node = ref.current;

        if (!node) {
            return undefined;
        }

        openRef.current = false;
        setOpen(false);

        const measure = () => {
            if (openRef.current || (node.offsetWidth === 0 && node.scrollWidth === 0)) {
                return;
            }

            setLong(node.scrollWidth > node.offsetWidth);
        };

        measure();

        const observer = new ResizeObserver(measure);

        observer.observe(node);

        return () => observer.disconnect();
    }, [value]);

    return (
        <Text
            as="div"
            {...restProps}
            ref={ref}
            color={color}
            className={b({open, long}, className)}
            onClick={long ? handleClick : undefined}
        >
            {value}
        </Text>
    );
};
