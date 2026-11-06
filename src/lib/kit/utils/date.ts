import {type DateTime, dateTimeParse} from '@gravity-ui/date-utils';

export const parseDate = (
    inputValue: unknown,
    outputFormat?: string,
    timeZone?: string,
): DateTime | null => {
    if (!inputValue) {
        return null;
    }

    let raw = inputValue as {seconds?: number} | string | number | Date;

    if (typeof raw === 'object' && raw !== null && 'seconds' in raw && raw.seconds) {
        raw = raw.seconds * 1000;
    }

    return dateTimeParse(raw, {format: outputFormat, timeZone}) || null;
};
