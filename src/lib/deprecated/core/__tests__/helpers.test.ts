import {SpecTypes} from '../constants';
import {
    isArraySpec,
    isBooleanSpec,
    isCorrectSpec,
    isNumberSpec,
    isObjectSpec,
    isStringSpec,
} from '../helpers';

describe('core/utils/common', () => {
    test('isCorrectSpec', () => {
        expect(isCorrectSpec(true)).toBe(false);
        expect(isCorrectSpec({})).toBe(false);
        expect(isCorrectSpec([])).toBe(false);
        expect(isCorrectSpec({type: SpecTypes.Array, viewSpec: null})).toBe(false);
        expect(isCorrectSpec({type: SpecTypes.Array, viewSpec: {}})).toBe(false);
        expect(isCorrectSpec({type: SpecTypes.Array, viewSpec: {type: null}})).toBe(false);
        expect(isCorrectSpec({type: SpecTypes.Array, viewSpec: {type: 'base'}})).toBe(true);
    });

    test('isArraySpec', () => {
        expect(isArraySpec(true)).toBe(false);
        expect(isArraySpec({})).toBe(false);
        expect(isArraySpec([])).toBe(false);
        expect(isArraySpec({type: SpecTypes.String})).toBe(false);
        expect(isArraySpec({type: SpecTypes.Array})).toBe(true);
    });

    test('isBooleanSpec', () => {
        expect(isBooleanSpec(true)).toBe(false);
        expect(isBooleanSpec({})).toBe(false);
        expect(isBooleanSpec([])).toBe(false);
        expect(isBooleanSpec({type: SpecTypes.String})).toBe(false);
        expect(isBooleanSpec({type: SpecTypes.Boolean})).toBe(true);
    });

    test('isNumberSpec', () => {
        expect(isNumberSpec(true)).toBe(false);
        expect(isNumberSpec({})).toBe(false);
        expect(isNumberSpec([])).toBe(false);
        expect(isNumberSpec({type: SpecTypes.String})).toBe(false);
        expect(isNumberSpec({type: SpecTypes.Number})).toBe(true);
    });

    test('isObjectSpec', () => {
        expect(isObjectSpec(true)).toBe(false);
        expect(isObjectSpec({})).toBe(false);
        expect(isObjectSpec([])).toBe(false);
        expect(isObjectSpec({type: SpecTypes.String})).toBe(false);
        expect(isObjectSpec({type: SpecTypes.Object})).toBe(true);
    });

    test('isStringSpec', () => {
        expect(isStringSpec(true)).toBe(false);
        expect(isStringSpec({})).toBe(false);
        expect(isStringSpec([])).toBe(false);
        expect(isStringSpec({type: SpecTypes.Array})).toBe(false);
        expect(isStringSpec({type: SpecTypes.String})).toBe(true);
    });
});
