import React from 'react';

import {Text} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './LongValue.scss';

const b = block('long-value');

export interface LongValueProps {
    value?: string | number | boolean;
    className?: string;
}

export const LongValue: React.FC<LongValueProps> = ({value, className}) => {
    const prevValue = React.useRef<typeof value | null>(null);
    const ref = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [long, setLong] = React.useState(false);

    const handleClick = React.useCallback(() => setOpen((f) => !f), [setOpen]);

    const currentTextProperies = React.useMemo(() => {
        let wordBreak: 'break-all' | undefined;
        let whiteSpace: 'break-spaces' | undefined;

        if (open) {
            wordBreak = 'break-all';
            whiteSpace = 'break-spaces';
        }

        return {wordBreak, whiteSpace};
    }, [open]);

    React.useEffect(() => {
        if (ref.current) {
            if (value !== prevValue.current) {
                const {offsetWidth, scrollWidth} = ref.current;

                if (offsetWidth < scrollWidth) {
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

                prevValue.current = value;
            }
        }
    });

    return (
        <div className={b('container')} ref={ref} onClick={long ? handleClick : undefined}>
            <Text className={b({long}, className)} ellipsis={true} {...currentTextProperies}>
                {value}
            </Text>
        </div>
    );
};
