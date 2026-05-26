import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import type {
    ArraySpec,
    ArrayValue,
    BooleanSpec,
    NumberSpec,
    ObjectSpec,
    ObjectValue,
    StringSpec,
} from '../../core';
import {divide, multiply} from '../utils';
import {ErrorMessages} from '../validators';

import {isFloat, isInt} from './helpers';
import type {ErrorMessagesType} from './types';

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
    ignoreInvalidZeroFormat?: boolean;
    ignoreZeroEnd?: boolean;
}

type NumberSyntaxFlags = Pick<
    GetNumberValidatorParams,
    | 'ignoreRequiredCheck'
    | 'ignoreSpaceStartCheck'
    | 'ignoreSpaceEndCheck'
    | 'ignoreNumberCheck'
    | 'ignoreDotEnd'
    | 'ignoreZeroStart'
    | 'ignoreInvalidZeroFormat'
    | 'ignoreZeroEnd'
>;

// eslint-disable-next-line complexity
const validateNumberSyntax = (
    stringValue: string,
    required: boolean | undefined,
    flags: NumberSyntaxFlags,
    errorMessages: ErrorMessagesType,
): string | false => {
    if (!flags.ignoreRequiredCheck && required && !stringValue.length) {
        return errorMessages.REQUIRED;
    }

    if (!stringValue.length) {
        return false;
    }

    if (!flags.ignoreSpaceStartCheck && !stringValue[0].trim()) {
        return errorMessages.SPACE_START;
    }

    if (!flags.ignoreSpaceEndCheck && !stringValue[stringValue.length - 1].trim()) {
        return errorMessages.SPACE_END;
    }

    if (!flags.ignoreDotEnd && stringValue[stringValue.length - 1] === '.') {
        return errorMessages.DOT_END;
    }

    if (!flags.ignoreNumberCheck && !isFloat(stringValue)) {
        return errorMessages.NUMBER;
    }

    if (
        !flags.ignoreZeroStart &&
        ((stringValue.length > 1 && stringValue[0] === '0' && stringValue[1] !== '.') ||
            (stringValue.length > 2 &&
                stringValue.substring(0, 2) === '-0' &&
                stringValue[2] !== '.'))
    ) {
        return errorMessages.ZERO_START;
    }

    if (
        !flags.ignoreInvalidZeroFormat &&
        stringValue.trim().length > 1 &&
        Number(stringValue.trim()) === 0
    ) {
        return errorMessages.INVALID_ZERO_FORMAT;
    }

    if (
        !flags.ignoreZeroEnd &&
        !isInt(stringValue) &&
        stringValue[stringValue.length - 1] === '0'
    ) {
        return errorMessages.ZERO_END;
    }

    return false;
};

export const getNumberValidator = (params: GetNumberValidatorParams = {}) => {
    const {
        ignoreMaximumCheck,
        ignoreMinimumCheck,
        ignoreIntCheck,
        customErrorMessages,
        ...syntaxFlags
    } = params;

    return (spec: NumberSpec, value: string | number = '') => {
        const errorMessages = {...ErrorMessages, ...customErrorMessages};
        const stringValue = String(value);

        const syntaxError = validateNumberSyntax(
            stringValue,
            spec.required,
            syntaxFlags,
            errorMessages,
        );
        if (syntaxError) {
            return syntaxError;
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

export interface GetNumberWithScaleValidatorParams extends GetNumberValidatorParams {}

const scaleLimit = (limit: number, defaultFactor: string, scaleFactor: string): string | null => {
    if (defaultFactor === scaleFactor) {
        return String(limit);
    }

    const limitStr = String(limit);

    try {
        if (BigInt(scaleFactor) > BigInt(defaultFactor)) {
            const ratio = divide(scaleFactor, defaultFactor);
            return ratio ? divide(limitStr, ratio, 6) : null;
        }

        const ratio = divide(defaultFactor, scaleFactor);
        return ratio ? multiply(limitStr, ratio, 6) : null;
    } catch {
        return null;
    }
};

const isReadable = (numStr: string | null): boolean => {
    if (numStr === null) {
        return false;
    }

    // Math.abs does not support BigInt
    const intPart = numStr.split('.')[0].replace('-', '');

    try {
        return BigInt(intPart) >= BigInt(1);
    } catch {
        return false;
    }
};

const getMostAppropriateScale = (
    sizeParams: NonNullable<StringSpec['viewSpec']['sizeParams']>,
    value: string,
    limit: number,
): string => {
    const {defaultType, scale} = sizeParams;

    const limitStr = String(limit);
    const hasValidValue = Boolean(value) && divide(value, value) !== null;

    const defaultFactor = scale[defaultType].factor;
    let bestType = defaultType;

    Object.keys(scale).forEach((key) => {
        if (BigInt(scale[key].factor) > BigInt(scale[bestType].factor)) {
            const ratio = divide(scale[key].factor, defaultFactor);

            if (!ratio) {
                return;
            }

            if (!isReadable(divide(limitStr, ratio, 2))) {
                return;
            }

            if (hasValidValue && !isReadable(divide(value, ratio, 2))) {
                return;
            }

            bestType = key;
        }
    });

    return bestType;
};

const getScaledLimit = (
    spec: StringSpec,
    limit: number,
    value: string,
): {count: string; scaleTitle: string} | undefined => {
    const sizeParams = spec.viewSpec?.sizeParams;

    if (!sizeParams) {
        return undefined;
    }

    const selectedScale = getMostAppropriateScale(sizeParams, value, limit);
    const scaleEntry = sizeParams.scale[selectedScale];
    const defaultEntry = sizeParams.scale[sizeParams.defaultType];

    if (!scaleEntry || !defaultEntry) {
        return undefined;
    }

    const count = scaleLimit(limit, defaultEntry.factor, scaleEntry.factor);

    if (count === null) {
        return undefined;
    }

    return {count, scaleTitle: scaleEntry.title};
};

export const getNumberWithScaleValidator = (params: GetNumberWithScaleValidatorParams = {}) => {
    const {
        ignoreMaximumCheck,
        ignoreMinimumCheck,
        ignoreIntCheck,
        customErrorMessages,
        ...syntaxFlags
    } = params;

    return (spec: StringSpec, value = '') => {
        const errorMessages = {...ErrorMessages, ...customErrorMessages};
        const numericSpec = spec as unknown as NumberSpec;
        const stringValue = String(value);

        const syntaxError = validateNumberSyntax(
            stringValue,
            spec.required,
            syntaxFlags,
            errorMessages,
        );
        if (syntaxError) {
            return syntaxError;
        }

        if (
            !ignoreMaximumCheck &&
            isNumber(numericSpec.maximum) &&
            stringValue.length &&
            Number(stringValue) > numericSpec.maximum
        ) {
            const scaled = getScaledLimit(spec, numericSpec.maximum, stringValue);
            return scaled
                ? errorMessages.maxNumberWithScale(scaled.count, scaled.scaleTitle)
                : errorMessages.maxNumber(numericSpec.maximum);
        }

        if (
            !ignoreMinimumCheck &&
            isNumber(numericSpec.minimum) &&
            stringValue.length &&
            numericSpec.minimum > Number(stringValue)
        ) {
            const scaled = getScaledLimit(spec, numericSpec.minimum, stringValue);
            return scaled
                ? errorMessages.minNumberWithScale(scaled.count, scaled.scaleTitle)
                : errorMessages.minNumber(numericSpec.minimum);
        }

        if (isString(numericSpec.format) && stringValue.length) {
            if (!ignoreIntCheck && numericSpec.format === 'int64' && !isInt(stringValue)) {
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
