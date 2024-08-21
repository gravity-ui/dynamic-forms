import React from 'react';

import once from 'lodash/once';

import {Text, type TextProps} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './LongValue.scss';

const b = block('long-value');

export interface LongValueProps extends TextProps {
    value?: string | number | boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const LongValue: React.FC<LongValueProps> = ({
    value,
    onClick,
    className: externalClassName,
    ...restProps
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [long, setLong] = React.useState(false);

    const handleClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            onClick?.(e);
            setOpen((f) => !f);
        },
        [setOpen, onClick],
    );

    const className = React.useMemo(
        () =>
            b(
                {
                    open,
                    long,
                    ...(restProps.color ? {[restProps.color]: true} : {}),
                },
                externalClassName,
            ),
        [open, long, externalClassName, restProps.color],
    );

    React.useEffect(() => {
        if (ref.current) {
            const {offsetWidth, scrollWidth} = ref.current;

            const setFlags = once((offsetW: number, scrollW: number) => {
                if (offsetW < scrollW) {
                    if (!long) {
                        setLong(true);
                    }
                } else {
                    if (long) {
                        setLong(false);
                    }

                    if (open) {
                        setOpen(false);
                    }
                }
            });

            // element has been rendered, but is not displayed on the page
            if (offsetWidth === 0 && scrollWidth === 0) {
                const observer = new IntersectionObserver((entries) => {
                    const entry = entries.find((e) => e.target === ref.current);

                    if (entry && entry.isIntersecting) {
                        const target = entry.target as HTMLDivElement;

                        setFlags(target.offsetWidth, target.scrollWidth);
                    }
                });

                observer.observe(ref.current);

                return () => {
                    observer.disconnect();
                };
            } else {
                setFlags(offsetWidth, scrollWidth);
            }
        }

        return;
    }, [value]);

    return (
        <Text
            as="div"
            {...restProps}
            ref={ref}
            className={b({open, long}, className)}
            // @ts-ignore
            onClick={long ? handleClick : undefined}
        >
            {value}
        </Text>
    );
};
