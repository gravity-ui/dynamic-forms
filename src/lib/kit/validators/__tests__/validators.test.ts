import _ from 'lodash';

import {ArraySpec, BooleanSpec, NumberSpec, ObjectSpec, SpecTypes, StringSpec} from '../../../core';
import {ErrorMessages} from '../messages';
import {
    getArrayValidator,
    getBooleanValidator,
    getNumberValidator,
    getObjectValidator,
    getStringValidator,
} from '../validators';

describe('kit/validators/validators', () => {
    test('getArrayValidator', () => {
        const validator = getArrayValidator();
        const spec: ArraySpec = {
            type: SpecTypes.Array,
            viewSpec: {type: ''},
        };

        expect(validator(spec, undefined)).toBe(false);
        expect(validator(spec, [])).toBe(false);

        spec.minLength = BigInt(1);

        expect(getArrayValidator({ignoreMinLengthCheck: true})(spec, undefined)).toBe(false);
        expect(validator(spec, undefined)).toBe(ErrorMessages.minLengthArr(spec.minLength));
        expect(validator(spec, [])).toBe(ErrorMessages.minLengthArr(spec.minLength));
        expect(validator(spec, [null])).toBe(false);

        spec.minLength = undefined;
        spec.maxLength = BigInt(1);

        expect(validator(spec, undefined)).toBe(false);
        expect(validator(spec, [null])).toBe(false);
        expect(getArrayValidator({ignoreMaxLengthCheck: true})(spec, undefined)).toBe(false);
        expect(validator(spec, [null, null])).toBe(ErrorMessages.maxLengthArr(spec.maxLength));

        spec.maxLength = undefined;
        spec.required = true;

        expect(getArrayValidator({ignoreRequiredCheck: true})(spec, undefined)).toBe(false);
        expect(validator(spec, undefined)).toBe(ErrorMessages.REQUIRED);
        expect(validator(spec, [])).toBe(false);
    });

    test('getBooleanValidator', () => {
        const validator = getBooleanValidator();
        const spec: BooleanSpec = {
            type: SpecTypes.Boolean,
            viewSpec: {type: ''},
        };

        expect(validator(spec, undefined)).toBe(false);
        expect(validator(spec, false)).toBe(false);

        spec.required = true;

        expect(getBooleanValidator({ignoreRequiredCheck: true})(spec, undefined)).toBe(false);
        expect(validator(spec, undefined)).toBe(ErrorMessages.REQUIRED);
        expect(validator(spec, false)).toBe(ErrorMessages.REQUIRED);
        expect(validator(spec, true)).toBe(false);
    });

    test('getNumberValidator', () => {
        const validator = getNumberValidator();
        const spec: NumberSpec = {
            type: SpecTypes.Number,
            viewSpec: {type: ''},
        };

        expect(validator(spec, undefined)).toBe(false);
        expect(validator(spec, '')).toBe(false);

        spec.format = 'int64';

        expect(getNumberValidator({ignoreIntCheck: true})(spec, '1.01')).toBe(false);
        expect(validator(spec, '1.01')).toBe(ErrorMessages.INT);
        expect(validator(spec, 1.01)).toBe(ErrorMessages.INT);
        expect(validator(spec, 1)).toBe(false);

        spec.format = undefined;
        spec.minimum = 100.5;

        expect(getNumberValidator({ignoreMinimumCheck: true})(spec, '1.01')).toBe(false);
        expect(validator(spec, '1.01')).toBe(ErrorMessages.minNumber(spec.minimum));
        expect(validator(spec, 1.01)).toBe(ErrorMessages.minNumber(spec.minimum));
        expect(validator(spec, 101)).toBe(false);

        spec.minimum = undefined;
        spec.maximum = 0.5;

        expect(getNumberValidator({ignoreMaximumCheck: true})(spec, '1.01')).toBe(false);
        expect(validator(spec, '1.01')).toBe(ErrorMessages.maxNumber(spec.maximum));
        expect(validator(spec, 1.01)).toBe(ErrorMessages.maxNumber(spec.maximum));
        expect(validator(spec, 0)).toBe(false);

        spec.maximum = undefined;
        spec.required = true;

        expect(getNumberValidator({ignoreRequiredCheck: true})(spec, undefined)).toBe(false);
        expect(validator(spec, undefined)).toBe(ErrorMessages.REQUIRED);
        expect(validator(spec, 0)).toBe(false);

        spec.required = undefined;

        expect(getNumberValidator({ignoreSpaceStartCheck: true})(spec, ' 10')).toBe(
            ErrorMessages.NUMBER,
        );
        expect(validator(spec, ' 1')).toBe(ErrorMessages.SPACE_START);
        expect(validator(spec, '11')).toBe(false);

        expect(getNumberValidator({ignoreSpaceEndCheck: true})(spec, '10 ')).toBe(
            ErrorMessages.NUMBER,
        );
        expect(validator(spec, '1 ')).toBe(ErrorMessages.SPACE_END);
        expect(validator(spec, '11')).toBe(false);

        expect(getNumberValidator({ignoreDotEnd: true})(spec, '10.')).toBe(false);
        expect(validator(spec, '1.')).toBe(ErrorMessages.DOT_END);
        expect(validator(spec, '11.1')).toBe(false);

        expect(getNumberValidator({ignoreNumberCheck: true})(spec, '1q2')).toBe(false);
        expect(validator(spec, '1q2')).toBe(ErrorMessages.NUMBER);
        expect(validator(spec, '12')).toBe(false);

        expect(getNumberValidator({ignoreZeroStart: true})(spec, '007')).toBe(false);
        expect(validator(spec, '007')).toBe(ErrorMessages.ZERO_START);
        expect(validator(spec, '7')).toBe(false);
    });

    test('getObjectValidator', () => {
        const validator = getObjectValidator();
        const spec: ObjectSpec = {
            type: SpecTypes.Object,
            viewSpec: {type: ''},
        };

        expect(validator(spec, undefined)).toBe(false);
        expect(validator(spec, {})).toBe(false);

        spec.required = true;

        expect(getObjectValidator({ignoreRequiredCheck: true})(spec, undefined)).toBe(false);
        expect(validator(spec, undefined)).toBe(ErrorMessages.REQUIRED);
        expect(validator(spec, {})).toBe(false);
    });

    test('getStringValidator', () => {
        const validator = getStringValidator();
        const spec: StringSpec = {
            type: SpecTypes.String,
            viewSpec: {type: ''},
        };

        expect(validator(spec, undefined)).toBe(false);
        expect(validator(spec, '')).toBe(false);

        spec.pattern = '[0-9]';

        expect(getStringValidator({ignoreRegExpCheck: true})(spec, 'foo')).toBe(false);
        expect(validator(spec, 'foo')).toBe(ErrorMessages.INVALID);

        spec.patternError = 'Numbers only';

        expect(validator(spec, 'foo')).toBe(spec.patternError);
        expect(validator(spec, '007')).toBe(false);

        spec.pattern = undefined;
        spec.patternError = undefined;
        spec.minLength = BigInt(5);

        expect(getStringValidator({ignoreMinLengthCheck: true})(spec, 'foo')).toBe(false);
        expect(validator(spec, 'foo')).toBe(ErrorMessages.minLength(spec.minLength));
        expect(validator(spec, 'foobar')).toBe(false);

        spec.minLength = undefined;
        spec.maxLength = BigInt(5);

        expect(getStringValidator({ignoreMaxLengthCheck: true})(spec, 'foobar')).toBe(false);
        expect(validator(spec, 'foobar')).toBe(ErrorMessages.maxLength(spec.maxLength));
        expect(validator(spec, 'foo')).toBe(false);

        spec.maxLength = undefined;
        spec.required = true;

        expect(getStringValidator({ignoreRequiredCheck: true})(spec, undefined)).toBe(false);
        expect(validator(spec, undefined)).toBe(ErrorMessages.REQUIRED);
        expect(validator(spec, '')).toBe(ErrorMessages.REQUIRED);
        expect(validator(spec, 'foo')).toBe(false);

        spec.required = undefined;

        expect(getStringValidator({ignoreSpaceStartCheck: true})(spec, ' foo')).toBe(false);
        expect(validator(spec, ' foo')).toBe(ErrorMessages.SPACE_START);
        expect(validator(spec, 'foo')).toBe(false);

        expect(getStringValidator({ignoreSpaceEndCheck: true})(spec, 'foo ')).toBe(false);
        expect(validator(spec, 'foo ')).toBe(ErrorMessages.SPACE_END);
        expect(validator(spec, 'foo')).toBe(false);
    });
});
