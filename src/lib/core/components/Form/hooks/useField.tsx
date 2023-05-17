import React from 'react';

import _ from 'lodash';

import {isArraySpec, isNumberSpec, isObjectSpec} from '../../../helpers';
import {Spec} from '../../../types';
import {OBJECT_ARRAY_CNT, OBJECT_ARRAY_FLAG, REMOVED_ITEM} from '../constants';
import {
    DynamicFormsContext,
    FieldArrayValue,
    FieldRenderProps,
    FieldValue,
    ValidateError,
} from '../types';
import {isArrayItem, transformArrIn, transformArrOut} from '../utils';

export interface UseFieldProps<Value extends FieldValue, SpecType extends Spec> {
    name: string;
    spec: SpecType;
    initialValue: Value;
    value: Value;
    validate?: (value?: Value) => ValidateError;
    tools: DynamicFormsContext['tools'];
    parentOnChange:
        | ((
              childName: string,
              childValue: FieldValue,
              childErrors: Record<string, ValidateError>,
          ) => void)
        | null;
    parentOnUnmount: ((childName: string) => void) | null;
}

export const useField = <Value extends FieldValue, SpecType extends Spec>({
    name,
    spec,
    initialValue,
    value: externalValue,
    validate: propsValidate,
    tools,
    parentOnChange,
    parentOnUnmount,
}: UseFieldProps<Value, SpecType>): FieldRenderProps<Value> => {
    const firstRenderRef = React.useRef(true);

    const validate = React.useCallback(
        (value: Value) => {
            if (value === REMOVED_ITEM) {
                return;
            }

            return propsValidate?.(transformArrOut(value));
        },
        [propsValidate],
    );

    const [state, setState] = React.useState(() => {
        let value = _.cloneDeep(externalValue);

        if (_.isNil(value)) {
            if (spec.defaultValue) {
                value = transformArrIn(spec.defaultValue) as Value;
            }
            // if the spec with type array or object, and this spec has "required === true",
            // we immediately exclude empty value
            else if (spec.required) {
                if (isArraySpec(spec)) {
                    value = {[OBJECT_ARRAY_FLAG]: true, [OBJECT_ARRAY_CNT]: 0} as unknown as Value;
                } else if (isObjectSpec(spec)) {
                    value = {} as unknown as Value;
                }
            }
        }

        const error = validate?.(value);
        const dirty = !_.isEqual(value, initialValue);
        const pristine = value === initialValue;

        return {
            active: false,
            dirty,
            error,
            invalid: Boolean(error),
            modified: dirty || !pristine,
            pristine,
            touched: dirty || !pristine,
            valid: !error,
            value,
            visited: dirty || !pristine,
            childErrors: {},
        };
    });

    const {onChange, onDrop} = React.useMemo(() => {
        const onChange = (
            valOrSetter: Value | ((currentValue: Value) => Value),
            childErrors?: Record<string, ValidateError>,
        ) => {
            setState((state) => {
                const _value = _.isFunction(valOrSetter) ? valOrSetter(state.value) : valOrSetter;
                const error = validate?.(_value);
                let value = transformArrIn(_value);

                if (isNumberSpec(spec) && value && !error) {
                    value = Number(value) as Value;
                }

                let newChildErrors: Record<string, ValidateError> = {...state.childErrors};

                if (childErrors) {
                    const nearestChildName = _.keys(childErrors).sort(
                        (a, b) => a.length - b.length,
                    )[0];

                    if (nearestChildName) {
                        const existingСhildNames = _.keys(newChildErrors).filter((childName) =>
                            childName.startsWith(nearestChildName),
                        );

                        newChildErrors = {
                            ..._.omit(newChildErrors, existingСhildNames),
                            ...childErrors,
                        };
                    }
                }

                return {
                    ...state,
                    dirty: !_.isEqual(value, initialValue),
                    error,
                    invalid: Boolean(error),
                    modified: true,
                    pristine: value === initialValue,
                    touched: true,
                    valid: !error,
                    value,
                    visited: true,
                    childErrors: newChildErrors,
                };
            });
        };

        const onDrop = () => {
            if (isArrayItem(name)) {
                onChange(REMOVED_ITEM as Value);
            } else {
                onChange(undefined as Value);
            }
        };

        return {onChange, onDrop};
    }, [initialValue, setState, name, validate, spec]);

    const onBlur = React.useCallback(() => {
        setState((state) => ({
            ...state,
            active: false,
            touched: true,
        }));
    }, [setState]);

    const onFocus = React.useCallback(() => {
        setState((state) => ({
            ...state,
            active: true,
            visited: true,
        }));
    }, [setState]);

    const renderProps: FieldRenderProps<Value> = React.useMemo(() => {
        const onItemAdd = (_value: FieldValue) => {
            const stateValue = (state.value || {
                [OBJECT_ARRAY_FLAG]: true,
                [OBJECT_ARRAY_CNT]: 0,
            }) as Value;
            const value = {
                ...(stateValue as FieldArrayValue),
                [`<${(stateValue as FieldArrayValue)[OBJECT_ARRAY_CNT]}>`]: transformArrIn(_value),
                [OBJECT_ARRAY_CNT]: (stateValue as FieldArrayValue)[OBJECT_ARRAY_CNT] + 1,
            } as Value;
            const error = validate?.(value);

            setState((state) => ({
                ...state,
                dirty: !_.isEqual(value, initialValue),
                error,
                invalid: Boolean(error),
                modified: true,
                pristine: value === initialValue,
                touched: true,
                valid: !error,
                value,
                visited: true,
            }));
        };

        const onItemRemove = (idx: string | number) => {
            const value = {
                ...(state.value as FieldArrayValue),
                [`<${idx}>`]: REMOVED_ITEM,
            } as Value;
            const error = validate?.(value);

            setState((state) => ({
                ...state,
                dirty: !_.isEqual(value, initialValue),
                error,
                invalid: Boolean(error),
                modified: true,
                pristine: value === initialValue,
                touched: true,
                valid: !error,
                value,
                visited: true,
            }));
        };

        return {
            input: {
                name,
                value: state.value,
                onChange,
                onBlur,
                onFocus,
                onDrop,
            },
            arrayInput: {
                name,
                value: state.value,
                onItemAdd,
                onItemRemove,
                onDrop,
            },
            meta: {..._.omit(state, 'value'), submitFailed: tools.submitFailed},
        };
    }, [
        state,
        setState,
        validate,
        name,
        initialValue,
        tools.submitFailed,
        onChange,
        onBlur,
        onFocus,
        onDrop,
    ]);

    React.useEffect(() => {
        if (!firstRenderRef.current || !_.isEqual(externalValue, state.value) || state.error) {
            (parentOnChange ? parentOnChange : tools.onChange)(name, state.value, {
                ...state.childErrors,
                [name]: state.error,
            });
        }
    }, [state.value]);

    React.useEffect(() => {
        firstRenderRef.current = false;

        return () => {
            (parentOnUnmount ? parentOnUnmount : tools.onUnmount)(name);
        };
    }, []);

    return renderProps;
};
