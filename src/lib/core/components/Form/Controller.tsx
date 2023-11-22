import _ from 'lodash';

import {Spec} from '../../types';

import {
    useComponents,
    useControllerMirror,
    useDynamicFormsCtx,
    useField,
    useRender,
    useSearch,
    useSpec,
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
    const spec = useSpec({name, spec: _spec, mutators});
    const {inputEntity, Layout} = useComponents(spec);
    const render = useRender({name, spec, inputEntity, Layout});
    const validate = useValidate(spec);
    const renderProps = useField({
        name,
        initialValue: _.get(tools.initialValue, name),
        value,
        spec,
        originalSpec: _spec,
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
