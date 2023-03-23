import _ from 'lodash';

import {isCorrectSpec} from '../../helpers';
import {Spec} from '../../types';

import {useComponents, useDynamicFormsCtx, useField, useRender, useValidate} from './hooks';
import {useSearch} from './hooks/useSearch';
import {FieldValue, ValidateError} from './types';

export interface ControllerProps<Value extends FieldValue, SpecType extends Spec> {
    spec: SpecType;
    name: string;
    initialValue: Value;
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
    initialValue,
    parentOnChange,
    parentOnUnmount,
}: ControllerProps<Value, SpecType>) => {
    const {tools} = useDynamicFormsCtx();
    const {inputEntity, Layout} = useComponents(spec);
    const render = useRender({name, spec, inputEntity, Layout});
    const validate = useValidate(spec);
    const renderProps = useField({
        name,
        initialValue,
        spec,
        validate,
        tools,
        parentOnChange,
        parentOnUnmount,
    });
    const withSearch = useSearch(spec, renderProps.input.value, name);

    if (_.isString(name) && isCorrectSpec(spec)) {
        return withSearch(render(renderProps));
    }

    return null;
};
