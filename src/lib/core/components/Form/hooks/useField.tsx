import React from 'react';

import _ from 'lodash';

import {isArraySpec, isNumberSpec, isObjectSpec} from '../../../helpers';
import {Spec} from '../../../types';
import {EMPTY_MUTATOR, OBJECT_ARRAY_CNT, OBJECT_ARRAY_FLAG} from '../constants';
import {
    DynamicFormMutators,
    DynamicFormsContext,
    FieldArrayValue,
    FieldObjectValue,
    FieldRenderProps,
    FieldValue,
    ValidateError,
} from '../types';
import {
    isArrayItem,
    isErrorMutatorCorrect,
    isValueMutatorCorrect,
    transformArrIn,
    transformArrOut,
} from '../utils';

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
    mutators: DynamicFormMutators;
}

export const useField = <Value extends FieldValue, SpecType extends Spec>({
    name,
    spec,
    initialValue,
    value: externalValue,
    validate: propsValidate,
    tools,
    parentOnChange,
    parentOnUnmount: externalParentOnUnmount,
    mutators,
}: UseFieldProps<Value, SpecType>): FieldRenderProps<Value> => {
    const firstRenderRef = React.useRef(true);

    const validate = React.useCallback(
        (value: Value) => propsValidate?.(transformArrOut(value)),
        [propsValidate],
    );

    const [state, setState] = React.useState(() => {
        const valueMutator = _.get(mutators.values, name, EMPTY_MUTATOR) as
            | Value
            | typeof EMPTY_MUTATOR;
        let value = _.cloneDeep(externalValue);

        if (isValueMutatorCorrect(valueMutator, spec) && valueMutator !== EMPTY_MUTATOR) {
            value = valueMutator;
        }

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

        let errorMutator = _.get(mutators.errors, name);

        if (!isErrorMutatorCorrect(errorMutator)) {
            errorMutator = undefined;
        }

        const error = validate?.(value) || errorMutator;
        const dirty = !_.isEqual(value, initialValue);

        return {
            active: false,
            dirty,
            error,
            invalid: Boolean(error),
            modified: dirty,
            pristine: true,
            touched: false,
            valid: !error,
            value,
            visited: false,
            childErrors: {},
        };
    });

    const {onChange, onLocalChange, onDrop} = React.useMemo(() => {
        const onLocalChange = (
            valOrSetter: Value | ((currentValue: Value) => Value),
            childErrors?: Record<string, ValidateError>,
            errorMutator?: ValidateError,
        ) => {
            setState((state) => {
                const _value = _.isFunction(valOrSetter) ? valOrSetter(state.value) : valOrSetter;
                const error = validate?.(_value) || errorMutator;
                let value = transformArrIn(_value);

                if (isNumberSpec(spec) && !error) {
                    value = (value ? Number(value) : undefined) as Value;
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

        const onChange = (
            valOrSetter: Value | ((currentValue: Value) => Value),
            childErrors?: Record<string, ValidateError>,
        ) => onLocalChange(valOrSetter, childErrors);

        const onDrop = () => {
            if (isArrayItem(name)) {
                (externalParentOnUnmount ? externalParentOnUnmount : tools.onUnmount)(name);
            } else {
                onChange(undefined as Value, {[name]: false});
            }
        };

        return {onChange, onLocalChange, onDrop};
    }, [initialValue, setState, name, validate, spec, externalParentOnUnmount, tools.onUnmount]);

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

    const parentOnUnmount = React.useCallback(
        (childName: string) => {
            if (isArraySpec(spec) || isObjectSpec(spec)) {
                onChange(
                    (currentValue) =>
                        currentValue
                            ? (_.omit(
                                  currentValue as FieldArrayValue | FieldObjectValue,
                                  childName.split(`${name}.`)[1],
                              ) as Value)
                            : currentValue,
                    {
                        [childName]: false,
                    },
                );
            }
        },
        [onChange, name, spec],
    );

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
            parentOnUnmount(`${name}.<${idx}>`);
        };

        return {
            input: {
                name,
                value: state.value,
                onChange,
                onBlur,
                onFocus,
                onDrop,
                parentOnUnmount,
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
        parentOnUnmount,
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
        if (!firstRenderRef.current) {
            const valueMutator = _.get(mutators.values, name, EMPTY_MUTATOR) as
                | Value
                | typeof EMPTY_MUTATOR;
            let errorMutator = _.get(mutators.errors, name);

            if (!isErrorMutatorCorrect(errorMutator)) {
                errorMutator = undefined;
            }

            if (
                isValueMutatorCorrect(valueMutator, spec) &&
                valueMutator !== state.value &&
                valueMutator !== EMPTY_MUTATOR
            ) {
                onLocalChange(valueMutator, undefined, errorMutator);
            } else if (state.error !== errorMutator && !(state.error && !errorMutator)) {
                setState({...state, error: errorMutator});
                (parentOnChange ? parentOnChange : tools.onChange)(name, state.value, {
                    ...state.childErrors,
                    [name]: errorMutator,
                });
            }
        }
    }, [mutators]);

    React.useEffect(() => {
        firstRenderRef.current = false;

        return () => {
            (externalParentOnUnmount ? externalParentOnUnmount : tools.onUnmount)(name);
        };
    }, []);

    return renderProps;
};
