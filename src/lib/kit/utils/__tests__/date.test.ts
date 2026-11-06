import {dateTime} from '@gravity-ui/date-utils';

import {parseDate} from '../date';

describe('parseDate', () => {
    test('returns null for empty values', () => {
        expect(parseDate(undefined)).toBeNull();
        expect(parseDate(null)).toBeNull();
        expect(parseDate('')).toBeNull();
        expect(parseDate(0)).toBeNull();
        expect(parseDate(false)).toBeNull();
    });

    test('parses an ISO string', () => {
        const result = parseDate('2020-01-01T00:00:00.000Z');

        expect(result).not.toBeNull();
        expect(result?.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    });

    test('parses a Date instance', () => {
        const result = parseDate(new Date('2020-01-01T00:00:00.000Z'));

        expect(result).not.toBeNull();
        expect(result?.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    });

    test('parses a millisecond timestamp', () => {
        const timestamp = Date.UTC(2020, 0, 1);
        const result = parseDate(timestamp);

        expect(result).not.toBeNull();
        expect(result?.valueOf()).toBe(timestamp);
    });

    test('parses a timestamp object with seconds', () => {
        const result = parseDate({seconds: 1577836800, nanos: 0});

        expect(result).not.toBeNull();
        expect(result?.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    });

    test('does not convert a timestamp object when seconds is 0', () => {
        const result = parseDate({seconds: 0});

        expect(result?.toISOString()).not.toBe('1970-01-01T00:00:00.000Z');
    });

    test('parses a string with the given output format', () => {
        const result = parseDate('01.01.2020 00:00', 'DD.MM.YYYY HH:mm');

        expect(result).not.toBeNull();
        expect(result?.format('YYYY-MM-DD')).toBe('2020-01-01');
    });

    test('applies the given time zone', () => {
        const result = parseDate('2020-01-01T00:00:00.000Z', undefined, 'America/New_York');

        expect(result).not.toBeNull();
        expect(result?.timeZone()).toBe('America/New_York');
        expect(result?.format('YYYY-MM-DD HH:mm')).toBe('2019-12-31 19:00');
    });

    test('returns a DateTime equivalent to dateTime for the same input', () => {
        const input = '2020-06-15T12:30:00.000Z';
        const result = parseDate(input);

        expect(result?.valueOf()).toBe(dateTime({input}).valueOf());
    });

    test('returns null for an unparseable value', () => {
        expect(parseDate('not-a-date')).toBeNull();
        expect(parseDate({foo: 'bar'})).toBeNull();
    });
});
