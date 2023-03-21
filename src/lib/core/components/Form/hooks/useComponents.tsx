import React from 'react';

import _ from 'lodash';
import {isValidElementType} from 'react-is';

import {isCorrectConfig} from '..';
import {isCorrectSpec} from '../../../helpers';
import {FormValue, Spec} from '../../../types';
import {FieldValue, IndependentInputEntity, InputEntity, LayoutType, TypeConfig} from '../types';

import {useDynamicFormsCtx} from './';

export const useComponents = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>(
    spec: SpecType,
) => {
    const {config} = useDynamicFormsCtx();

    const {inputs, layouts}: TypeConfig<DirtyValue, Value, SpecType> | Record<string, undefined> =
        React.useMemo(() => {
            if (isCorrectConfig(config) && isCorrectSpec(spec)) {
                return config[spec.type];
            }

            return {};
        }, [config, spec]);

    const inputEntity:
        | InputEntity<DirtyValue, SpecType>
        | IndependentInputEntity<DirtyValue, SpecType>
        | undefined = React.useMemo(() => {
        if (inputs) {
            const entity = inputs[spec.viewSpec.type];

            if (isValidElementType(entity?.Component)) {
                return entity;
            }
        }

        return;
    }, [inputs, spec?.viewSpec?.type]);

    const Layout: LayoutType<DirtyValue, SpecType> | undefined = React.useMemo(() => {
        if (layouts && _.isString(spec.viewSpec.layout)) {
            const Component = layouts[spec.viewSpec.layout];

            if (isValidElementType(Component)) {
                return Component;
            }
        }

        return;
    }, [layouts, spec?.viewSpec?.layout]);

    return {inputEntity, Layout};
};
