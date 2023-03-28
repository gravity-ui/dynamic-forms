import _ from 'lodash';

import {
    ArraySpec,
    ArrayValue,
    BooleanSpec,
    NumberSpec,
    ObjectSpec,
    ObjectValue,
    StringSpec,
} from '../../core';
import {ErrorMessages} from '../validators';

import {isFloat, isInt} from './helpers';

export interface GetArrayValidatorParams {
    ignoreRequiredCheck?: boolean;
    ignoreMaxLengthCheck?: boolean;
    ignoreMinLengthCheck?: boolean;
}

export const getArrayValidator = (params: GetArrayValidatorParams = {}) => {
    const {ignoreRequiredCheck, ignoreMaxLengthCheck, ignoreMinLengthCheck} = params;

    return (spec: ArraySpec, value?: ArrayValue) => {
        const valueLength = value?.length || 0;

        if (!ignoreRequiredCheck && spec.required && !_.isArray(value)) {
            return ErrorMessages.REQUIRED;
        }

        if (
            !ignoreMaxLengthCheck &&
            typeof spec.maxLength === 'bigint' &&
            valueLength > spec.maxLength
        ) {
            return ErrorMessages.maxLengthArr(spec.maxLength);
        }

        if (
            !ignoreMinLengthCheck &&
            typeof spec.minLength === 'bigint' &&
            valueLength < spec.minLength
        ) {
            return ErrorMessages.minLengthArr(spec.minLength);
        }

        return false;
    };
};

export interface GetBooleanValidatorParams {
    ignoreRequiredCheck?: boolean;
}

export const getBooleanValidator = (params: GetBooleanValidatorParams = {}) => {
    const {ignoreRequiredCheck} = params;

    return (spec: BooleanSpec, value?: boolean) => {
        if (!ignoreRequiredCheck && spec.required && !value) {
            return ErrorMessages.REQUIRED;
        }

        return false;
    };
};

export interface GetNumberValidatorParams {
    ignoreRequiredCheck?: boolean;
    ignoreSpaceStartCheck?: boolean;
    ignoreSpaceEndCheck?: boolean;
    ignoreNumberCheck?: boolean;
    ignoreMaximumCheck?: boolean;
    ignoreMinimumCheck?: boolean;
    ignoreIntCheck?: boolean;
}

export const getNumberValidator = (params: GetNumberValidatorParams = {}) => {
    const {
        ignoreRequiredCheck,
        ignoreSpaceStartCheck,
        ignoreSpaceEndCheck,
        ignoreNumberCheck,
        ignoreMaximumCheck,
        ignoreMinimumCheck,
        ignoreIntCheck,
    } = params;

    return (spec: NumberSpec, value: string | number = '') => {
        const stringValue = String(value);

        if (!ignoreRequiredCheck && spec.required && !stringValue.length) {
            return ErrorMessages.REQUIRED;
        }

        if (stringValue.length) {
            if (!ignoreSpaceStartCheck && !stringValue[0].trim()) {
                return ErrorMessages.SPACE_START;
            }

            if (!ignoreSpaceEndCheck && !stringValue[stringValue.length - 1].trim()) {
                return ErrorMessages.SPACE_END;
            }

            if (stringValue[stringValue.length - 1] === '.') {
                return ErrorMessages.DOT_END;
            }

            if (!ignoreNumberCheck && !isFloat(stringValue)) {
                return ErrorMessages.NUMBER;
            }

            if (
                (stringValue.length > 1 && stringValue[0] === '0' && stringValue[1] !== '.') ||
                (stringValue.length > 2 &&
                    stringValue.substring(0, 2) === '-0' &&
                    stringValue[2] !== '.')
            ) {
                return ErrorMessages.ZERO_START;
            }
        }

        if (
            !ignoreMaximumCheck &&
            _.isNumber(spec.maximum) &&
            stringValue.length &&
            Number(stringValue) > spec.maximum
        ) {
            return ErrorMessages.maxNumber(spec.maximum);
        }

        if (
            !ignoreMinimumCheck &&
            _.isNumber(spec.minimum) &&
            ((stringValue.length && spec.minimum > Number(stringValue)) || !stringValue.length)
        ) {
            return ErrorMessages.minNumber(spec.minimum);
        }

        if (_.isString(spec.format) && stringValue.length) {
            if (!ignoreIntCheck && spec.format === 'int64' && !isInt(stringValue)) {
                return ErrorMessages.INT;
            }
        }

        return false;
    };
};

export interface GetObjectValidatorParams {
    ignoreRequiredCheck?: boolean;
}

export const getObjectValidator = (params: GetObjectValidatorParams = {}) => {
    const {ignoreRequiredCheck} = params;

    return (spec: ObjectSpec, value?: ObjectValue) => {
        if (!ignoreRequiredCheck && spec.required && !value) {
            return ErrorMessages.REQUIRED;
        }

        return false;
    };
};

export interface GetStringValidatorParams {
    ignoreRequiredCheck?: boolean;
    ignoreSpaceStartCheck?: boolean;
    ignoreSpaceEndCheck?: boolean;
    ignoreMaxLengthCheck?: boolean;
    ignoreMinLengthCheck?: boolean;
    ignoreRegExpCheck?: boolean;
}

export const getStringValidator = (params: GetStringValidatorParams = {}) => {
    const {
        ignoreRequiredCheck,
        ignoreSpaceStartCheck,
        ignoreSpaceEndCheck,
        ignoreMaxLengthCheck,
        ignoreMinLengthCheck,
        ignoreRegExpCheck,
    } = params;

    return (spec: StringSpec, value = '') => {
        const valueLength = value?.length;

        if (!ignoreRequiredCheck && spec.required && !valueLength) {
            return ErrorMessages.REQUIRED;
        }

        if (valueLength) {
            if (!ignoreSpaceStartCheck && !value[0].trim()) {
                return ErrorMessages.SPACE_START;
            }

            if (!ignoreSpaceEndCheck && !value[value.length - 1].trim()) {
                return ErrorMessages.SPACE_END;
            }
        }

        if (
            !ignoreMaxLengthCheck &&
            typeof spec.maxLength === 'bigint' &&
            valueLength > spec.maxLength
        ) {
            return ErrorMessages.maxLength(spec.maxLength);
        }

        if (
            !ignoreMinLengthCheck &&
            typeof spec.minLength === 'bigint' &&
            valueLength < spec.minLength
        ) {
            return ErrorMessages.minLength(spec.minLength);
        }

        if (_.isString(spec.pattern) && spec.pattern.length) {
            const regex = new RegExp(spec.pattern);

            if (!ignoreRegExpCheck && !regex.test(value)) {
                return _.isString(spec.patternError) && spec.patternError.length
                    ? spec.patternError
                    : ErrorMessages.INVALID;
            }
        }

        return false;
    };
};
