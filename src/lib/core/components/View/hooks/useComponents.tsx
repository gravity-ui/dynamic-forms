import React from 'react';

import _ from 'lodash';
import {isValidElementType} from 'react-is';

import {isCorrectSpec} from '../../../helpers';
import {FormValue, Spec} from '../../../types';
import {isCorrectViewConfig} from '../helpers';
import {IndependentViewEntity, ViewEntity, ViewLayoutType, ViewTypeConfig} from '../types';

import {useDynamicFormsCtx} from './';

export const useComponents = <Value extends FormValue, SpecType extends Spec>(spec: SpecType) => {
    const {config} = useDynamicFormsCtx();

    const {views, layouts}: ViewTypeConfig<Value, SpecType> | Record<string, undefined> =
        React.useMemo(() => {
            if (isCorrectViewConfig(config) && isCorrectSpec(spec)) {
                return config[spec.type];
            }

            return {};
        }, [config, spec]);

    const viewEntity:
        | ViewEntity<Value, SpecType>
        | IndependentViewEntity<Value, SpecType>
        | undefined = React.useMemo(() => {
        if (views) {
            const entity = views[spec.viewSpec.type];

            if (isValidElementType(entity?.Component)) {
                return entity;
            }
        }

        return;
    }, [views, spec?.viewSpec?.type]);

    const Layout: ViewLayoutType<Value, SpecType> | undefined = React.useMemo(() => {
        if (layouts && _.isString(spec.viewSpec.layout)) {
            const Component = layouts[spec.viewSpec.layout];

            if (isValidElementType(Component)) {
                return Component;
            }
        }

        return;
    }, [layouts, spec?.viewSpec?.layout]);

    return {viewEntity, Layout};
};
