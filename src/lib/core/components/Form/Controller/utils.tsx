import React from 'react';

import _ from 'lodash';
import {isValidElementType} from 'react-is';

import {SpecTypes} from '../../../constants';
import {isArraySpec, isCorrectSpec, isNumberSpec, isObjectSpec} from '../../../helpers';
import {FormValue, Spec} from '../../../types';
import {EMPTY_MUTATOR, OBJECT_ARRAY_CNT, OBJECT_ARRAY_FLAG} from '../constants';
import {
    BaseValidateError,
    FieldArrayValue,
    FieldObjectValue,
    FieldRenderProps,
    FieldValue,
    TypeConfig,
    ValidateError,
} from '../types';
import {isArrayItem, isCorrectConfig, transformArrIn, transformArrOut} from '../utils';

import {
    ControllerStore,
    GetComponentsParams,
    GetComponentsReturn,
    GetFieldInitialsParams,
    GetFieldMethodsReturn,
    GetRenderParams,
    GetSpecParams,
    GetValidateParams,
    InitializeStoreParams,
    UpdateStoreParams,
} from './types';

const isErrorMutatorCorrect = (errorMutator: {value: ValidateError} | typeof EMPTY_MUTATOR) =>
    errorMutator !== EMPTY_MUTATOR &&
    (_.isString(errorMutator.value) ||
        _.isBoolean(errorMutator.value) ||
        _.isUndefined(errorMutator.value));

const isValueMutatorCorrect = (
    valueMutator: {value: FormValue} | typeof EMPTY_MUTATOR,
    spec: Spec,
) =>
    valueMutator !== EMPTY_MUTATOR &&
    (typeof valueMutator.value === spec.type ||
        (_.isArray(valueMutator.value) && spec.type === SpecTypes.Array) ||
        valueMutator.value === undefined);

export const updateParentStore = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>(
    store: ControllerStore<DirtyValue, Value, SpecType>,
) => {
    (store.parentOnChange ? store.parentOnChange : store.tools.onChange)(
        store.name,
        store.state.value,
        {
            ...store.state.childErrors,
            [store.name]: store.state.error,
        },
    );
};

export const callUnmout = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>(
    store: ControllerStore<DirtyValue, Value, SpecType>,
) => {
    (store.parentOnUnmount ? store.parentOnUnmount : store.tools.onUnmount)(store.name);
};

export const getSpec = <SpecType extends Spec>({
    name,
    spec,
    mutatorsStore,
}: GetSpecParams<SpecType>): SpecType => {
    const mutator = _.get(mutatorsStore.spec, name, EMPTY_MUTATOR);

    if (mutator !== EMPTY_MUTATOR) {
        const mutatedSpec = _.merge(_.cloneDeep(spec), mutator.value);

        if (isCorrectSpec(mutatedSpec)) {
            return mutatedSpec;
        }
    }

    return spec;
};

export const getComponents = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>({
    spec,
    config,
}: GetComponentsParams<SpecType>): GetComponentsReturn<DirtyValue, SpecType> => {
    const result: GetComponentsReturn<DirtyValue, SpecType> = {};

    if (isCorrectConfig(config) && isCorrectSpec(spec)) {
        const {inputs, layouts} = config[spec.type] as unknown as
            | TypeConfig<DirtyValue, Value, SpecType>
            | Record<string, undefined>;

        if (inputs) {
            const entity = inputs[spec.viewSpec.type];

            if (isValidElementType(entity?.Component)) {
                result.inputEntity = entity;
            }
        }

        if (layouts && _.isString(spec.viewSpec.layout)) {
            const Component = layouts[spec.viewSpec.layout];

            if (isValidElementType(Component)) {
                result.Layout = Component;
            }
        }
    }

    return result;
};

export const getRender = <DirtyValue extends FieldValue, SpecType extends Spec>({
    name,
    spec,
    inputEntity,
    Layout,
}: GetRenderParams<DirtyValue, SpecType>) => {
    const render = (props: FieldRenderProps<DirtyValue>) => {
        if (inputEntity && isCorrectSpec(spec) && _.isString(name)) {
            if (!spec.viewSpec.hidden) {
                if (inputEntity.independent) {
                    const InputComponent = inputEntity.Component;

                    return <InputComponent spec={spec} name={name} Layout={Layout} {...props} />;
                }

                const InputComponent = inputEntity.Component;
                const input = <InputComponent spec={spec} name={name} {...props} />;

                if (Layout) {
                    return (
                        <Layout spec={spec} name={name} {...props}>
                            {input}
                        </Layout>
                    );
                }

                return input;
            }
        }

        return null;
    };

    return render;
};

export const getValidate = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>({
    spec,
    config,
}: GetValidateParams<SpecType>) => {
    let validate: (value?: Value) => ValidateError = () => undefined;

    if (isCorrectConfig(config) && isCorrectSpec(spec)) {
        const {validators} = config[spec.type] as unknown as
            | TypeConfig<DirtyValue, Value, SpecType>
            | Record<string, undefined>;

        if (validators) {
            if (
                (!_.isString(spec.validator) || !spec.validator.length) &&
                _.isFunction(validators.base)
            ) {
                validate = (value?: Value) => validators.base(spec, value);
            }

            if (_.isString(spec.validator) && _.isFunction(validators[spec.validator])) {
                validate = (value?: Value) => validators[spec.validator!]!(spec, value);
            }
        }
    }

    return validate;
};

export const getFieldInitials = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>({
    name,
    spec,
    valueFromParent,
    initialValue,
    validate,
    mutatorsStore,
}: GetFieldInitialsParams<DirtyValue, Value, SpecType>) => {
    const valueMutator = transformArrIn(_.get(mutatorsStore.values, name, EMPTY_MUTATOR)) as
        | {value: DirtyValue}
        | typeof EMPTY_MUTATOR;
    let value = _.cloneDeep(valueFromParent);

    if (isValueMutatorCorrect(valueMutator, spec)) {
        value = (valueMutator as {value: DirtyValue}).value;
    }

    if (_.isNil(value)) {
        if (spec.defaultValue) {
            value = transformArrIn(spec.defaultValue) as DirtyValue;
        }
        // if the spec with type array or object, and this spec has "required === true",
        // we immediately exclude empty value
        else if (spec.required) {
            if (isArraySpec(spec)) {
                value = {[OBJECT_ARRAY_FLAG]: true, [OBJECT_ARRAY_CNT]: 0} as unknown as DirtyValue;
            } else if (isObjectSpec(spec)) {
                value = {} as unknown as DirtyValue;
            }
        }
    }

    let errorMutator: {value: BaseValidateError} | typeof EMPTY_MUTATOR = _.get(
        mutatorsStore.errors,
        name,
        EMPTY_MUTATOR,
    );

    if (!isErrorMutatorCorrect(errorMutator)) {
        errorMutator = {value: undefined};
    }

    const error =
        validate?.(transformArrOut(value)) || (errorMutator as {value: BaseValidateError})?.value;
    const dirty = !_.isEqual(value, initialValue);

    return {
        initialValue,
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
};

export const getFieldMethods = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>(): GetFieldMethodsReturn<DirtyValue, Value, SpecType> => {
    const onChange: GetFieldMethodsReturn<DirtyValue, Value, SpecType>['onChange'] = (
        store,
        {valOrSetter, childErrors, errorMutator},
    ) => {
        const {state, validate, spec} = store;
        const _value = _.isFunction(valOrSetter) ? valOrSetter(state.value) : valOrSetter;
        const error = validate?.(transformArrOut(_value)) || errorMutator;
        let value = transformArrIn(_value);

        if (isNumberSpec(spec) && !error) {
            value = (value ? Number(value) : undefined) as DirtyValue;
        }

        let newChildErrors: Record<string, ValidateError> = {...state.childErrors};

        if (childErrors) {
            const nearestChildName = _.keys(childErrors).sort((a, b) => a.length - b.length)[0];

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

        const nextStore = {
            ...store,
            state: {
                ...store.state,
                dirty: !_.isEqual(value, state.initialValue),
                error,
                invalid: Boolean(error),
                modified: true,
                pristine: value === state.initialValue,
                touched: true,
                valid: !error,
                value,
                visited: true,
                childErrors: newChildErrors,
            },
        };

        nextStore.afterStoreUpdateCB = () => updateParentStore(nextStore);

        return nextStore;
    };

    const onDrop: GetFieldMethodsReturn<DirtyValue, Value, SpecType>['onDrop'] = (store) => {
        const {name} = store;

        if (isArrayItem(name)) {
            const afterStoreUpdateCB = () => callUnmout(store);

            return {...store, afterStoreUpdateCB};
        }

        return onChange(store, {
            valOrSetter: undefined as DirtyValue,
            childErrors: {[name]: false},
        });
    };

    const onBlur: GetFieldMethodsReturn<DirtyValue, Value, SpecType>['onBlur'] = (store) => {
        return {
            ...store,
            state: {
                ...store.state,
                active: false,
                touched: true,
            },
        };
    };

    const onFocus: GetFieldMethodsReturn<DirtyValue, Value, SpecType>['onFocus'] = (store) => {
        return {
            ...store,
            state: {
                ...store.state,
                active: true,
                visited: true,
            },
        };
    };

    const parentOnUnmount: GetFieldMethodsReturn<DirtyValue, Value, SpecType>['parentOnUnmount'] = (
        store,
        childName,
    ) => {
        const {name, spec} = store;

        if (isArraySpec(spec) || isObjectSpec(spec)) {
            return onChange(store, {
                valOrSetter: (currentValue) =>
                    currentValue
                        ? (_.omit(
                              currentValue as FieldArrayValue | FieldObjectValue,
                              childName.split(`${name}.`)[1],
                          ) as DirtyValue)
                        : currentValue,
                childErrors: {[childName]: false},
            });
        }

        return store;
    };

    const onItemAdd: GetFieldMethodsReturn<DirtyValue, Value, SpecType>['onItemAdd'] = (
        store,
        _value,
    ) => {
        const {validate, state} = store;
        const stateValue = (state.value || {
            [OBJECT_ARRAY_FLAG]: true,
            [OBJECT_ARRAY_CNT]: 0,
        }) as DirtyValue;
        const value = {
            ...(stateValue as FieldArrayValue),
            [`<${(stateValue as FieldArrayValue)[OBJECT_ARRAY_CNT]}>`]: transformArrIn(_value),
            [OBJECT_ARRAY_CNT]: (stateValue as FieldArrayValue)[OBJECT_ARRAY_CNT] + 1,
        } as DirtyValue;
        const error = validate?.(transformArrOut(value));

        const nextStore = {
            ...store,
            state: {
                ...store.state,
                dirty: !_.isEqual(value, store.state.initialValue),
                error,
                invalid: Boolean(error),
                modified: true,
                pristine: value === store.state.initialValue,
                touched: true,
                valid: !error,
                value,
                visited: true,
            },
        };

        nextStore.afterStoreUpdateCB = () => updateParentStore(nextStore);

        return nextStore;
    };

    const onItemRemove: GetFieldMethodsReturn<DirtyValue, Value, SpecType>['onItemRemove'] = (
        store,
        idx,
    ) => {
        return parentOnUnmount(store, `${store.name}.<${idx}>`);
    };

    return {
        onChange,
        onDrop,
        onBlur,
        onFocus,
        parentOnUnmount,
        onItemAdd,
        onItemRemove,
    };
};

export const initializeStore = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>({
    name,
    spec: _spec,
    mutatorsStore,
    config,
    valueFromParent,
    tools,
    parentOnChange,
    parentOnUnmount,
}: InitializeStoreParams<DirtyValue, SpecType>): ControllerStore<DirtyValue, Value, SpecType> => {
    const spec = getSpec({name, spec: _spec, mutatorsStore});
    const components = getComponents<DirtyValue, Value, SpecType>({spec, config});
    const render = getRender({name, spec, ...components});
    const validate = getValidate({spec, config});
    const state = getFieldInitials({
        name,
        spec,
        valueFromParent,
        validate,
        mutatorsStore,
        initialValue: _.get(tools.initialValue, name),
    });

    const initialsStore: ControllerStore<DirtyValue, Value, SpecType> = {
        name,
        spec,
        initialSpec: _spec,
        config,
        tools,
        mutatorsStore,
        render,
        validate,
        parentOnChange,
        parentOnUnmount,
        state,
    };

    if (!_.isEqual(valueFromParent, state.value) || state.error) {
        initialsStore.afterStoreUpdateCB = () => updateParentStore(initialsStore);
    }

    return initialsStore;
};

export const updateStore = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>({
    store,
    setStore,
    spec: _spec,
    name,
    parentOnChange,
    parentOnUnmount,
    mutatorsStore,
    valueFromParent,
    config,
    tools,
    methodOnChange,
}: UpdateStoreParams<DirtyValue, Value, SpecType>) => {
    const storeSpecMutator = _.get(store.mutatorsStore.spec, store.name, EMPTY_MUTATOR);
    const storeValueMutator = _.get(store.mutatorsStore.values, store.name, EMPTY_MUTATOR) as
        | {value: DirtyValue}
        | typeof EMPTY_MUTATOR;
    const storeErrorMutator = _.get(store.mutatorsStore.errors, store.name, EMPTY_MUTATOR);

    const specMutator = _.get(mutatorsStore.spec, name, EMPTY_MUTATOR);
    const valueMutator = _.get(mutatorsStore.values, name, EMPTY_MUTATOR) as
        | {value: DirtyValue}
        | typeof EMPTY_MUTATOR;
    const errorMutator = _.get(mutatorsStore.errors, name, EMPTY_MUTATOR);

    const valueMutatorUpdated =
        isValueMutatorCorrect(valueMutator, getSpec({name, spec: _spec, mutatorsStore})) &&
        valueMutator !== storeValueMutator;
    const errorMutatorUpdated =
        isErrorMutatorCorrect(errorMutator) && errorMutator !== storeErrorMutator;

    const updateState = valueMutatorUpdated || errorMutatorUpdated;
    const updateNonCritical =
        parentOnChange !== store.parentOnChange ||
        parentOnUnmount !== store.parentOnUnmount ||
        tools.onChange !== store.tools.onChange ||
        tools.onUnmount !== store.tools.onUnmount;
    const updateAllStore =
        !_.isEqual(_spec, store.initialSpec) ||
        config !== store.config ||
        (specMutator !== EMPTY_MUTATOR && specMutator !== storeSpecMutator);
    const updateAllStoreAndClearParentValues = name !== store.name;

    if (updateAllStoreAndClearParentValues) {
        callUnmout(store);
        setStore(
            initializeStore({
                name,
                spec: _spec,
                mutatorsStore,
                config,
                valueFromParent,
                tools,
                parentOnChange,
                parentOnUnmount,
            }),
        );
    } else if (updateAllStore) {
        let nextStore: ControllerStore<DirtyValue, Value, SpecType> = {
            ...initializeStore({
                name,
                spec: _spec,
                mutatorsStore,
                config,
                valueFromParent,
                tools,
                parentOnChange,
                parentOnUnmount,
            }),
            state: store.state,
        };

        if (updateState) {
            nextStore = methodOnChange(nextStore, {
                valOrSetter: (value) =>
                    valueMutatorUpdated ? (valueMutator as {value: DirtyValue}).value : value,
                ...(errorMutatorUpdated
                    ? {errorMutator: (errorMutator as {value: BaseValidateError}).value}
                    : {}),
            });
        }

        setStore(nextStore);
    } else if (updateNonCritical) {
        let nextStore = {
            ...store,
            parentOnChange,
            parentOnUnmount,
            tools,
        };

        if (updateState) {
            nextStore = methodOnChange(nextStore, {
                valOrSetter: (value) =>
                    valueMutatorUpdated ? (valueMutator as {value: DirtyValue}).value : value,
                ...(errorMutatorUpdated
                    ? {errorMutator: (errorMutator as {value: BaseValidateError}).value}
                    : {}),
            });
        }

        setStore(nextStore);
    } else if (updateState) {
        setStore(
            methodOnChange(
                {...store, mutatorsStore},
                {
                    valOrSetter: (value) =>
                        valueMutatorUpdated ? (valueMutator as {value: DirtyValue}).value : value,
                    ...(errorMutatorUpdated
                        ? {errorMutator: (errorMutator as {value: BaseValidateError}).value}
                        : {}),
                },
            ),
        );
    }
};
