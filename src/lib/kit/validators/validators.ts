import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

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
import {ErrorMessagesType} from './types';

interface CommonValidatorParams {
    ignoreRequiredCheck?: boolean;
    customErrorMessages?: Partial<ErrorMessagesType>;
}

export interface GetArrayValidatorParams extends CommonValidatorParams {
    ignoreMaxLengthCheck?: boolean;
    ignoreMinLengthCheck?: boolean;
}

export const getArrayValidator = (params: GetArrayValidatorParams = {}) => {
    const {ignoreRequiredCheck, ignoreMaxLengthCheck, ignoreMinLengthCheck, customErrorMessages} =
        params;

    return (spec: ArraySpec, value?: ArrayValue) => {
        const errorMessages = {...ErrorMessages, ...customErrorMessages};

        const valueLength = value?.length || 0;

        if (!ignoreRequiredCheck && spec.required && !isArray(value)) {
            return errorMessages.REQUIRED;
        }

        if (
            !ignoreMaxLengthCheck &&
            typeof spec.maxLength === 'bigint' &&
            valueLength > spec.maxLength
        ) {
            return errorMessages.maxLengthArr(spec.maxLength);
        }

        if (
            !ignoreMinLengthCheck &&
            typeof spec.minLength === 'bigint' &&
            valueLength < spec.minLength
        ) {
            return errorMessages.minLengthArr(spec.minLength);
        }

        return false;
    };
};

export interface GetBooleanValidatorParams extends CommonValidatorParams {}

export const getBooleanValidator = (params: GetBooleanValidatorParams = {}) => {
    const {ignoreRequiredCheck, customErrorMessages} = params;

    return (spec: BooleanSpec, value?: boolean) => {
        const errorMessages = {...ErrorMessages, ...customErrorMessages};

        if (!ignoreRequiredCheck && spec.required && !value) {
            return errorMessages.REQUIRED;
        }

        return false;
    };
};

export interface GetNumberValidatorParams extends CommonValidatorParams {
    ignoreSpaceStartCheck?: boolean;
    ignoreSpaceEndCheck?: boolean;
    ignoreNumberCheck?: boolean;
    ignoreMaximumCheck?: boolean;
    ignoreMinimumCheck?: boolean;
    ignoreIntCheck?: boolean;
    ignoreDotEnd?: boolean;
    ignoreZeroStart?: boolean;
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
        ignoreDotEnd,
        ignoreZeroStart,
        customErrorMessages,
    } = params;

    // eslint-disable-next-line complexity
    return (spec: NumberSpec, value: string | number = '') => {
        const errorMessages = {...ErrorMessages, ...customErrorMessages};

        const stringValue = String(value);

        if (!ignoreRequiredCheck && spec.required && !stringValue.length) {
            return errorMessages.REQUIRED;
        }

        if (stringValue.length) {
            if (!ignoreSpaceStartCheck && !stringValue[0].trim()) {
                return errorMessages.SPACE_START;
            }

            if (!ignoreSpaceEndCheck && !stringValue[stringValue.length - 1].trim()) {
                return errorMessages.SPACE_END;
            }

            if (!ignoreDotEnd && stringValue[stringValue.length - 1] === '.') {
                return errorMessages.DOT_END;
            }

            if (!ignoreNumberCheck && !isFloat(stringValue)) {
                return errorMessages.NUMBER;
            }

            if (
                !ignoreZeroStart &&
                ((stringValue.length > 1 && stringValue[0] === '0' && stringValue[1] !== '.') ||
                    (stringValue.length > 2 &&
                        stringValue.substring(0, 2) === '-0' &&
                        stringValue[2] !== '.'))
            ) {
                return errorMessages.ZERO_START;
            }
        }

        if (
            !ignoreMaximumCheck &&
            isNumber(spec.maximum) &&
            stringValue.length &&
            Number(stringValue) > spec.maximum
        ) {
            return errorMessages.maxNumber(spec.maximum);
        }

        if (
            !ignoreMinimumCheck &&
            isNumber(spec.minimum) &&
            stringValue.length &&
            spec.minimum > Number(stringValue)
        ) {
            return errorMessages.minNumber(spec.minimum);
        }

        if (isString(spec.format) && stringValue.length) {
            if (!ignoreIntCheck && spec.format === 'int64' && !isInt(stringValue)) {
                return errorMessages.INT;
            }
        }

        return false;
    };
};

export interface GetObjectValidatorParams extends CommonValidatorParams {}

export const getObjectValidator = (params: GetObjectValidatorParams = {}) => {
    const {ignoreRequiredCheck, customErrorMessages} = params;

    return (spec: ObjectSpec, value?: ObjectValue) => {
        const errorMessages = {...ErrorMessages, ...customErrorMessages};

        if (!ignoreRequiredCheck && spec.required && !value) {
            return errorMessages.REQUIRED;
        }

        return false;
    };
};

export interface GetStringValidatorParams extends CommonValidatorParams {
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
        customErrorMessages,
    } = params;

    // eslint-disable-next-line complexity
    return (spec: StringSpec, value = '') => {
        const errorMessages = {...ErrorMessages, ...customErrorMessages};

        const valueLength = value?.length;

        if (!ignoreRequiredCheck && spec.required && !valueLength) {
            return errorMessages.REQUIRED;
        }

        if (valueLength) {
            if (!ignoreSpaceStartCheck && !value[0].trim()) {
                return errorMessages.SPACE_START;
            }

            if (!ignoreSpaceEndCheck && !value[value.length - 1].trim()) {
                return errorMessages.SPACE_END;
            }
        }

        if (
            !ignoreMaxLengthCheck &&
            typeof spec.maxLength === 'bigint' &&
            valueLength > spec.maxLength
        ) {
            return errorMessages.maxLength(spec.maxLength);
        }

        if (
            !ignoreMinLengthCheck &&
            typeof spec.minLength === 'bigint' &&
            valueLength < spec.minLength
        ) {
            return errorMessages.minLength(spec.minLength);
        }

        if (isString(spec.pattern) && spec.pattern.length) {
            const regex = new RegExp(spec.pattern);

            if (!ignoreRegExpCheck && !regex.test(value)) {
                return isString(spec.patternError) && spec.patternError.length
                    ? spec.patternError
                    : errorMessages.INVALID;
            }
        }

        return false;
    };
};
