import _ from 'lodash';

import {Spec} from '../../types';

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
    spec,
    name,
    value,
    parentOnChange,
    parentOnUnmount,
}: ControllerProps<Value, SpecType>) => {
    const {tools, externalErrors, __mirror} = useDynamicFormsCtx();
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
        externalErrors,
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
