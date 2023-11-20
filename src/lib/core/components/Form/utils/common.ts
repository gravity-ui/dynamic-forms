import _ from 'lodash';

import {SpecTypes} from '../../../constants';
import {isStringSpec} from '../../../helpers';
import {FormValue, ObjectValue, Spec} from '../../../types';
import {OBJECT_ARRAY_CNT, OBJECT_ARRAY_FLAG, SPEC_TYPE_FOR_GENERATE_BUTTON} from '../constants';
import {ValidateError} from '../types';

export const isCorrectConfig = (candidate: any) =>
    Object.values(SpecTypes).every(
        (type) =>
            _.isObjectLike(candidate) &&
            _.isObjectLike(candidate[type]) &&
            _.isObjectLike(candidate[type].inputs) &&
            _.isObjectLike(candidate[type].layouts) &&
            _.isObjectLike(candidate[type].validators),
    );

export const transformArrIn = <Type extends FormValue, ReturnType extends FormValue = Type>(
    value: Type,
): ReturnType => {
    if (_.isArray(value)) {
        return value.reduce(
            (arrObj: ObjectValue, item, idx) => {
                arrObj[`<${idx}>`] = transformArrIn(item);

                return arrObj;
            },
            {[OBJECT_ARRAY_FLAG]: true, [OBJECT_ARRAY_CNT]: value.length},
        ) as ReturnType;
    }

    if (_.isObject(value)) {
        const _value: ObjectValue = {...value};

        _.forEach(_value, (item, key) => {
            _value[key] = transformArrIn(item);
        });

        return _value as ReturnType;
    }

    return value as unknown as ReturnType;
};

export const transformArrOut = <Type extends FormValue, ReturnType extends FormValue = Type>(
    value: Type,
): ReturnType => {
    if (_.isObject(value) && !_.isArray(value)) {
        if ((value as ObjectValue)[OBJECT_ARRAY_FLAG]) {
            const _value = Object.keys(value)
                .filter((key) => key !== OBJECT_ARRAY_FLAG && key !== OBJECT_ARRAY_CNT)
                .map((key) => key.split('<').join('').split('>').join(''))
                .sort((a, b) => Number(a) - Number(b))
                .map((key) => transformArrOut((value as ObjectValue)[`<${key}>`])) as ReturnType;

            return _value;
        }

        const _value: ObjectValue = {...(value as ObjectValue)};

        _.forEach(_value, (item, key) => {
            _value[key] = transformArrOut(item);
        });

        return _value as ReturnType;
    }

    return value as unknown as ReturnType;
};

export const isArrayItem = (name: string) => name[name.length - 1] === '>';

export const withGenerateButton = (spec: Spec) =>
    isStringSpec(spec) &&
    SPEC_TYPE_FOR_GENERATE_BUTTON.includes(spec.viewSpec.type) &&
    spec.viewSpec.generateRandomValueButton;

export const isErrorMutatorCorrect = (errorMutator: ValidateError) =>
    _.isString(errorMutator) || _.isBoolean(errorMutator) || _.isUndefined(errorMutator);

export const isValueMutatorCorrect = (valueMutator: FormValue, spec: Spec) =>
    typeof valueMutator === spec.type || (_.isArray(valueMutator) && spec.type === SpecTypes.Array);
