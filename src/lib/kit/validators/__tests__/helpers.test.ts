import type {StringSpec} from '../../../core';
import {SpecTypes} from '../../../core';
import {getScaledLimit, isFloat, isInt} from '../helpers';

describe('kit/validators/helpers', () => {
    test('isFloat', () => {
        expect(isFloat('q')).toBe(false);
        expect(isFloat('1.q')).toBe(false);
        expect(isFloat('1')).toBe(true);
        expect(isFloat('1.01')).toBe(true);
        expect(isFloat('-10.01')).toBe(true);
        expect(isFloat('-0.01')).toBe(true);
        expect(isFloat('-101.1')).toBe(true);
    });

    test('isInt', () => {
        expect(isInt('q')).toBe(false);
        expect(isInt('1.q')).toBe(false);
        expect(isInt('1.01')).toBe(false);
        expect(isInt('-0.01')).toBe(false);
        expect(isInt('11')).toBe(true);
        expect(isInt('-11')).toBe(true);
    });

    test('getScaledLimit', () => {
        const spec: StringSpec = {
            type: SpecTypes.String,
            viewSpec: {type: 'number_with_scale'},
        };

        expect(getScaledLimit(spec, 3600000)).toBeUndefined();

        spec.viewSpec.sizeParams = {
            scale: {
                msec: {factor: '1', title: 'msec'},
                sec: {factor: '1000', title: 'sec'},
                min: {factor: '60000', title: 'min'},
                hours: {factor: '3600000', title: 'hours'},
                days: {factor: '86400000', title: 'days'},
            },
            defaultType: 'msec',
        };

        expect(getScaledLimit(spec, 3600000)).toEqual({count: '1', scaleTitle: 'hours'});
        expect(getScaledLimit(spec, 86400000)).toEqual({count: '1', scaleTitle: 'days'});
        expect(getScaledLimit(spec, 1000)).toEqual({count: '1', scaleTitle: 'sec'});
        expect(getScaledLimit(spec, 90000)).toEqual({count: '1.5', scaleTitle: 'min'});
        expect(getScaledLimit(spec, 500)).toEqual({count: '500', scaleTitle: 'msec'});

        spec.viewSpec.sizeParams = {
            scale: {
                sec: {factor: '1', title: 'sec'},
                min: {factor: '60', title: 'min'},
                hours: {factor: '3600', title: 'hours'},
            },
            defaultType: 'sec',
        };

        expect(getScaledLimit(spec, 3600)).toEqual({count: '1', scaleTitle: 'hours'});
        expect(getScaledLimit(spec, 120)).toEqual({count: '2', scaleTitle: 'min'});
        expect(getScaledLimit(spec, 30)).toEqual({count: '30', scaleTitle: 'sec'});
    });
});
