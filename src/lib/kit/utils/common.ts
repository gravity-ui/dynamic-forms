import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';

import type {FormValue, NumberSpec, ObjectValue, Spec, StringSpec} from '../../core';
import {SpecTypes, isArraySpec, isObjectSpec, isStringSpec} from '../../core';
import {isFloat} from '../validators/helpers';

import {divide} from './bigIntMath';

export const isNotEmptyValue = (value: FormValue | undefined, spec: Spec | undefined): boolean => {
    if (isNil(value)) {
        return false;
    }

    if (isString(value)) {
        if (!value) {
            return false;
        }

        if (isStringSpec(spec) && spec.viewSpec.hideValues?.includes(value)) {
            return false;
        }
    }

    if (isObject(value) && isObjectSpec(spec)) {
        const keys = Object.keys(value);

        // the only case when an empty object is considered a non-empty value is when it is a stub for oneof
        if (
            !keys.filter((key) =>
                isNotEmptyValue((value as ObjectValue)[key], spec.properties?.[key]),
            ).length &&
            spec.viewSpec.type !== 'oneof'
        ) {
            return false;
        }
    }

    if (
        isArray(value) &&
        isArraySpec(spec) &&
        !value.filter((item) => isNotEmptyValue(item, spec.items)).length
    ) {
        return false;
    }

    return true;
};

export const prepareSpec = <Type extends Spec>(
    spec: Type,
    parseJsonDefaultValue?: boolean,
    overridePatternError?: (pattern?: string) => string,
): Type => {
    if (isObjectLike(spec)) {
        const result: Record<string, any> = cloneDeep(spec);

        if (isString(result.type)) {
            result.type = result.type.toLowerCase() as Spec['type'];
        }

        if (!isNil(result.defaultValue)) {
            let _defaultValue = result.defaultValue;

            if (parseJsonDefaultValue) {
                try {
                    _defaultValue = JSON.parse(result.defaultValue);
                } catch {
                    _defaultValue = undefined;
                }
            }

            if (
                typeof _defaultValue === result.type ||
                (isArray(_defaultValue) && result.type === SpecTypes.Array)
            ) {
                result.defaultValue = _defaultValue;
            } else {
                result.defaultValue = undefined;
            }
        }

        if (isString(result.viewSpec?.type)) {
            result.viewSpec.type = result.viewSpec.type.toLowerCase();
        }

        if (isString(result.viewSpec?.layout)) {
            result.viewSpec.layout = result.viewSpec.layout.toLowerCase();
        }

        if (isString(result.viewSpec?.addButtonPosition)) {
            result.viewSpec.addButtonPosition = result.viewSpec.addButtonPosition.toLowerCase();
        }

        if (isString(result.viewSpec?.oneOfParams?.toggler)) {
            result.viewSpec.oneOfParams.toggler = result.viewSpec.oneOfParams.toggler.toLowerCase();
        }

        if (isString(result.viewSpec?.textContentParams?.themeLabel)) {
            result.viewSpec.textContentParams.themeLabel =
                result.viewSpec.textContentParams.themeLabel.toLowerCase();
        }

        if (isString(result.viewSpec?.textContentParams?.themeAlert)) {
            result.viewSpec.textContentParams.themeAlert =
                result.viewSpec.textContentParams.themeAlert.toLowerCase();
        }

        if (isString(result.viewSpec?.textContentParams?.viewAlert)) {
            result.viewSpec.textContentParams.viewAlert =
                result.viewSpec.textContentParams.viewAlert.toLowerCase();
        }

        if (isString(result.validator)) {
            result.validator = result.validator.toLowerCase();
        }

        if (
            (result.maxLength as unknown as string) === '0' &&
            (result.minLength as unknown as string) === '0'
        ) {
            result.maxLength = undefined;
            result.minLength = undefined;
        } else {
            if (!isNil(result.maxLength) && isFloat(`${result.maxLength}`)) {
                result.maxLength = BigInt(result.maxLength);
            }

            if (!isNil(result.minLength) && isFloat(`${result.minLength}`)) {
                result.minLength = BigInt(result.minLength);
            }
        }

        if (!isEmpty(result.pattern) && isEmpty(result.patternError) && overridePatternError) {
            result.patternError = overridePatternError(result.pattern);
        }

        if (result.items) {
            result.items = prepareSpec(result.items, parseJsonDefaultValue, overridePatternError);
        }

        if (result.maximum === 0 && result.minimum === 0) {
            result.maximum = undefined;
            result.minimum = undefined;
        } else {
            if (!isNil(result.maximum) && isFloat(`${result.maximum}`)) {
                result.maximum = Number(result.maximum);
            }

            if (!isNil(result.minimum) && isFloat(`${result.minimum}`)) {
                result.minimum = Number(result.minimum);
            }
        }

        if (isString(result.format)) {
            result.format = result.format.toLowerCase() as NumberSpec['format'];
        }

        if (isObjectLike(result.properties)) {
            Object.keys(result.properties).forEach((key) => {
                result.properties[key] = prepareSpec(
                    result.properties[key],
                    parseJsonDefaultValue,
                    overridePatternError,
                );
            });
        }

        return result as Type;
    }

    return spec;
};

export const isCorrectSizeParams = (spec: StringSpec) => {
    const {sizeParams} = spec.viewSpec;

    if (
        !sizeParams ||
        !isString(sizeParams.defaultType) ||
        !isObject(sizeParams.scale) ||
        !sizeParams.scale[sizeParams.defaultType] ||
        Object.values(sizeParams.scale).some(({factor}) => !divide(factor, factor))
    ) {
        return false;
    }

    return true;
};
