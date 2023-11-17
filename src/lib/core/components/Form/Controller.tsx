import React from 'react';

import _ from 'lodash';

import {Spec} from '../../types';

import {EMPTY_MUTATOR} from './constants';
import {
    useComponents,
    useControllerMirror,
    useDynamicFormsCtx,
    useField,
    useRender,
    useSearch,
    useValidate,
} from './hooks';
import {ControllerMirror, FieldValue, ValidateError} from './types';

export interface ControllerProps<Value extends FieldValue, SpecType extends Spec> {
    spec: SpecType;
    name: string;
    value: Value;
    parentOnChange:
        | ((
              childName: string,
              childValue: FieldValue,
              childErrors: Record<string, ValidateError>,
          ) => void)
        | null;
    parentOnUnmount: ((childName: string) => void) | null;
}

export const Controller = <Value extends FieldValue, SpecType extends Spec>({
    spec: _spec,
    name,
    value,
    parentOnChange,
    parentOnUnmount,
}: ControllerProps<Value, SpecType>) => {
    const {tools, mutators, __mirror} = useDynamicFormsCtx();

    const spec = React.useMemo(() => {
        const specMutator = _.get(mutators.spec, name, EMPTY_MUTATOR);

        if (specMutator !== EMPTY_MUTATOR) {
            return _.merge(_spec, specMutator);
        }

        return _spec;
    }, [_spec, mutators.spec, name]);

    const {inputEntity, Layout} = useComponents(spec);
    const render = useRender({name, spec, inputEntity, Layout});
    const validate = useValidate(spec);
    const renderProps = useField({
        name,
        initialValue: _.get(tools.initialValue, name),
        value,
        spec,
        validate,
        tools,
        parentOnChange,
        parentOnUnmount,
        mutators,
    });
    const withSearch = useSearch(spec, renderProps.input.value, name);

    useControllerMirror(
        name,
        {
            useComponents: {inputEntity, Layout},
            useRender: render,
            useValidate: validate,
            useField: renderProps,
            useSearch: withSearch,
        } as ControllerMirror,
        __mirror,
    );

    return withSearch(render(renderProps));
};
