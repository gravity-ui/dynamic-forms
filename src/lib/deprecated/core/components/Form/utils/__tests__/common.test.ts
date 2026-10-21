import {dynamicConfig} from '../../../../../kit';
import {isArrayItem, isCorrectConfig, transformArrIn, transformArrOut} from '../common';

describe('Form/utils/common', () => {
    test('isCorrectConfig', () => {
        expect(isCorrectConfig(true)).toBe(false);
        expect(isCorrectConfig({})).toBe(false);
        expect(isCorrectConfig([])).toBe(false);
        expect(
            isCorrectConfig({
                string: {
                    inputs: {},
                    layouts: {},
                    validators: {},
                },
            }),
        ).toBe(false);
        expect(isCorrectConfig(dynamicConfig)).toBe(true);
    });

    test('transformArrIn', () => {
        const value = {
            name: {
                array: [1, 2, 3],
                boolean: true,
                number: 1,
                object: {boolean: false, number: 2},
                string: 'string',
            },
        };

        const transformedValue = {
            name: {
                array: {
                    '____arr-obj': true,
                    '____arr-obj-cnt': 3,
                    '<0>': 1,
                    '<1>': 2,
                    '<2>': 3,
                },
                boolean: true,
                number: 1,
                object: {
                    number: 2,
                    boolean: false,
                },
                string: 'string',
            },
        };

        expect(transformArrIn(value)).toMatchObject(transformedValue);
    });

    test('transformArrOut', () => {
        const value = {
            name: {
                arr: [0, 1, 2],
                array: {
                    '____arr-obj': true,
                    '____arr-obj-cnt': 3,
                    '<0>': 1,
                    '<1>': 2,
                    '<2>': 3,
                },
                boolean: true,
                number: 1,
                object: {
                    number: 2,
                    boolean: false,
                },
                string: 'string',
            },
        };

        const transformedValue = {
            name: {
                arr: [0, 1, 2],
                array: [1, 2, 3],
                boolean: true,
                number: 1,
                object: {boolean: false, number: 2},
                string: 'string',
            },
        };

        expect(transformArrOut(value)).toMatchObject(transformedValue);
    });

    test('isArrayItem', () => {
        expect(isArrayItem('name')).toBe(false);
        expect(isArrayItem('name>')).toBe(true);
    });
});
