import _ from 'lodash';

import {
    FormValue,
    NumberSpec,
    ObjectValue,
    Spec,
    SpecTypes,
    StringSpec,
    isArraySpec,
    isObjectSpec,
    isStringSpec,
} from '../../core';
import {isFloat} from '../validators/helpers';

import {divide} from './bigIntMath';

export const isNotEmptyValue = (value: FormValue | undefined, spec: Spec | undefined): boolean => {
    if (_.isNil(value)) {
        return false;
    }

    if (_.isString(value)) {
        if (!value) {
            return false;
        }

        if (isStringSpec(spec) && spec.viewSpec.hideValues?.includes(value)) {
            return false;
        }
    }

    if (_.isObject(value) && isObjectSpec(spec)) {
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
        _.isArray(value) &&
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
): Type => {
    if (_.isObjectLike(spec)) {
        const result: Record<string, any> = _.cloneDeep(spec);

        if (_.isString(result.type)) {
            result.type = result.type.toLowerCase() as Spec['type'];
        }

        if (!_.isNil(result.defaultValue)) {
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
                (_.isArray(_defaultValue) && result.type === SpecTypes.Array)
            ) {
                result.defaultValue = _defaultValue;
            } else {
                result.defaultValue = undefined;
            }
        }

        if (_.isString(result.viewSpec?.type)) {
            result.viewSpec.type = result.viewSpec.type.toLowerCase();
        }

        if (_.isString(result.viewSpec?.layout)) {
            result.viewSpec.layout = result.viewSpec.layout.toLowerCase();
        }

        if (_.isString(result.viewSpec?.oneOfParams?.toggler)) {
            result.viewSpec.oneOfParams.toggler = result.viewSpec.oneOfParams.toggler.toLowerCase();
        }

        if (_.isString(result.validator)) {
            result.validator = result.validator.toLowerCase();
        }

        if (
            (result.maxLength as unknown as string) === '0' &&
            (result.minLength as unknown as string) === '0'
        ) {
            result.maxLength = undefined;
            result.minLength = undefined;
        } else {
            if (!_.isNil(result.maxLength) && isFloat(`${result.maxLength}`)) {
                result.maxLength = BigInt(result.maxLength);
            }

            if (!_.isNil(result.minLength) && isFloat(`${result.minLength}`)) {
                result.minLength = BigInt(result.minLength);
            }
        }

        if (result.items) {
            result.items = prepareSpec(result.items, parseJsonDefaultValue);
        }

        if (result.maximum === 0 && result.minimum === 0) {
            result.maximum = undefined;
            result.minimum = undefined;
        } else {
            if (!_.isNil(result.maximum) && isFloat(`${result.maximum}`)) {
                result.maximum = Number(result.maximum);
            }

            if (!_.isNil(result.minimum) && isFloat(`${result.minimum}`)) {
                result.minimum = Number(result.minimum);
            }
        }

        if (_.isString(result.format)) {
            result.format = result.format.toLowerCase() as NumberSpec['format'];
        }

        if (_.isObjectLike(result.properties)) {
            Object.keys(result.properties).forEach((key) => {
                result.properties[key] = prepareSpec(result.properties[key], parseJsonDefaultValue);
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
        !_.isString(sizeParams.defaultType) ||
        !_.isObject(sizeParams.scale) ||
        !sizeParams.scale[sizeParams.defaultType] ||
        Object.values(sizeParams.scale).some(({factor}) => !divide(factor, factor))
    ) {
        return false;
    }

    return true;
};
