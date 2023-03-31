import {isFloat, isInt} from '../helpers';

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
});
