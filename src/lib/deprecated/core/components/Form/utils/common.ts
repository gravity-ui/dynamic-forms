import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isObjectLike from 'lodash/isObjectLike';

import {SpecTypes} from '../../../constants';
import {isStringSpec} from '../../../helpers';
import type {FormValue, ObjectValue, Spec} from '../../../types';
import {OBJECT_ARRAY_CNT, OBJECT_ARRAY_FLAG, SPEC_TYPE_FOR_GENERATE_BUTTON} from '../constants';

export const isCorrectConfig = (candidate: any) =>
    Object.values(SpecTypes).every(
        (type) =>
            isObjectLike(candidate) &&
            isObjectLike(candidate[type]) &&
            isObjectLike(candidate[type].inputs) &&
            isObjectLike(candidate[type].layouts) &&
            isObjectLike(candidate[type].validators),
    );

export const transformArrIn = <Type extends FormValue, ReturnType extends FormValue = Type>(
    value: Type,
): ReturnType => {
    if (isArray(value)) {
        return value.reduce(
            (arrObj: ObjectValue, item, idx) => {
                arrObj[`<${idx}>`] = transformArrIn(item);

                return arrObj;
            },
            {[OBJECT_ARRAY_FLAG]: true, [OBJECT_ARRAY_CNT]: value.length},
        ) as ReturnType;
    }

    if (isObject(value)) {
        const _value: ObjectValue = {...value};

        forEach(_value, (item, key) => {
            _value[key] = transformArrIn(item);
        });

        return _value as ReturnType;
    }

    return value as unknown as ReturnType;
};

export const transformArrOut = <Type extends FormValue, ReturnType extends FormValue = Type>(
    value: Type,
): ReturnType => {
    if (isObject(value) && !isArray(value)) {
        if ((value as ObjectValue)[OBJECT_ARRAY_FLAG]) {
            const _value = Object.keys(value)
                .filter((key) => key !== OBJECT_ARRAY_FLAG && key !== OBJECT_ARRAY_CNT)
                .map((key) => key.split('<').join('').split('>').join(''))
                .sort((a, b) => Number(a) - Number(b))
                .map((key) => transformArrOut((value as ObjectValue)[`<${key}>`])) as ReturnType;

            return _value;
        }

        const _value: ObjectValue = {...(value as ObjectValue)};

        forEach(_value, (item, key) => {
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
