import _ from 'lodash';

import {divide, multiply} from '../bigIntMath';

describe('kit/utils/bigIntMath', () => {
    test('divide', () => {
        expect(divide('q', '1000')).toBe(null);
        expect(divide('100', 'q')).toBe(null);
        expect(divide('100', '1000')).toBe('0.1');
        expect(divide('1', '1000000000000000000000000000000000000000000')).toBe(
            '0.000000000000000000000000000000000000000001',
        );
        expect(divide('1', '1000000000000000000000000000000000000000000', 4)).toBe('0');
        expect(divide('100000000000000000000000', '100000000000000000000000')).toBe('1');
        expect(divide('100', '-0.10')).toBe('-1000');
        expect(divide('-0.10', '-0.10')).toBe('1');
    });

    test('multiply', () => {
        expect(multiply('q', '1000')).toBe(null);
        expect(multiply('100', 'q')).toBe(null);
        expect(multiply('100', '0.5')).toBe('50');
        expect(
            multiply(
                '1000000000000000000000000000000000000000000',
                '1000000000000000000000000000000000000000000',
            ),
        ).toBe(
            '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        );
        expect(multiply('0.00037', '0.0068')).toBe('0.000002516');
        expect(multiply('0.00037', '0.0068', 2)).toBe('0');
        expect(multiply('100000000000000000000000', '0.000000000000000000000001')).toBe('0.1');
        expect(multiply('100', '-0.10')).toBe('-10');
        expect(multiply('-0.10', '-0.10')).toBe('0.01');
    });
});
