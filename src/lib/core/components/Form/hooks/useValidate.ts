import React from 'react';

import _ from 'lodash';

import {isCorrectConfig} from '..';
import {isCorrectSpec} from '../../../helpers';
import {FormValue, Spec} from '../../../types';
import {FieldValue, TypeConfig} from '../types';

import {useDynamicFormsCtx} from './';

export const useValidate = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>(
    spec: SpecType,
) => {
    const {config} = useDynamicFormsCtx();

    const {validators}: TypeConfig<DirtyValue, Value, SpecType> | Record<string, undefined> =
        React.useMemo(() => {
            if (isCorrectConfig(config) && isCorrectSpec(spec)) {
                return config[spec.type];
            }

            return {};
        }, [config, spec]);

    const validate = React.useMemo(() => {
        if (validators) {
            if (
                (!_.isString(spec.validator) || !spec.validator.length) &&
                _.isFunction(validators.base)
            ) {
                return (value?: Value) => validators.base(spec, value);
            }

            if (_.isString(spec.validator) && _.isFunction(validators[spec.validator])) {
                return (value?: Value) => validators[spec.validator!]!(spec, value);
            }
        }

        return;
    }, [validators, spec]);

    return validate;
};
