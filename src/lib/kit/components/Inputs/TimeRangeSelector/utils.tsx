import React from 'react';

import {Text} from '@gravity-ui/uikit';

export const filterTimeArray = (
    times: {id: string; value: string; content: string | JSX.Element; key: string}[],
    cutoff: string,
    direction: 'greater' | 'less',
) => {
    const isTimeFormat = (value: string) => /^\d{1,2}:\d{2}$/.test(value);

    const compareValues = (a: string, b: string) => {
        if (isTimeFormat(a) && isTimeFormat(b)) {
            return direction === 'less' ? a >= b : a <= b;
        } else {
            const aNum = parseInt(a, 10);
            const bNum = parseInt(b, 10);

            return direction === 'less' ? aNum >= bNum : aNum <= bNum;
        }
    };

    return times.map((time) => {
        const disabled = compareValues(time.value, cutoff);

        return {
            ...time,
            content: disabled ? <Text color="secondary">{time.content}</Text> : time.content,
            disabled,
        };
    });
};

export const validateArray = (arr: {value: string}[]) =>
    arr.every((obj) => /^(\d+|\d{1,2}:\d{1,2})$/.test(obj.value));
