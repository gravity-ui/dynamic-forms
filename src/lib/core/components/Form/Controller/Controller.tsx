import React from 'react';

import _ from 'lodash';

import {FormValue, Spec} from '../../../types';
import {useControllerMirror, useDynamicFormsCtx, useSearch} from '../hooks';
import {ControllerMirror, FieldValue, ValidateError} from '../types';

import {ControllerStore} from './types';
import {callUnmout, getFieldMethods, initializeStore, updateStore} from './utils';

export interface ControllerProps<DirtyValue extends FieldValue, SpecType extends Spec> {
    spec: SpecType;
    name: string;
    value: DirtyValue;
    parentOnChange:
        | ((
              childName: string,
              childValue: FieldValue,
              childErrors: Record<string, ValidateError>,
          ) => void)
        | null;
    parentOnUnmount: ((childName: string) => void) | null;
}

export const Controller = <
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
>({
    spec: _spec,
    name,
    value: valueFromParent,
    parentOnChange,
    parentOnUnmount,
}: ControllerProps<DirtyValue, SpecType>) => {
    const {config, tools, mutatorsStore, __mirror} = useDynamicFormsCtx();

    const firstRenderRef = React.useRef(true);
    const [store, setStore] = React.useState<ControllerStore<DirtyValue, Value, SpecType>>(
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

    const {methods, fieldMethods} = React.useMemo(() => {
        const fieldMethods = getFieldMethods<DirtyValue, Value, SpecType>();

        const onChange = (
            valOrSetter: DirtyValue | ((currentValue: DirtyValue) => DirtyValue),
            childErrors?: Record<string, ValidateError>,
            errorMutator?: ValidateError,
        ) => {
            setStore((store) =>
                fieldMethods.onChange(store, {valOrSetter, childErrors, errorMutator}),
            );
        };

        const onDrop = () => {
            setStore((store) => fieldMethods.onDrop(store, undefined));
        };

        const onBlur = () => {
            setStore((store) => fieldMethods.onBlur(store, undefined));
        };

        const onFocus = () => {
            setStore((store) => fieldMethods.onFocus(store, undefined));
        };

        const parentOnUnmount = (childName: string) => {
            setStore((store) => fieldMethods.parentOnUnmount(store, childName));
        };

        const onItemAdd = (value: FieldValue) => {
            setStore((store) => fieldMethods.onItemAdd(store, value));
        };

        const onItemRemove = (idx: string | number) => {
            setStore((store) => fieldMethods.onItemRemove(store, idx));
        };

        return {
            methods: {
                onChange,
                onDrop,
                onBlur,
                onFocus,
                parentOnUnmount,
                onItemAdd,
                onItemRemove,
            },
            fieldMethods,
        };
    }, [setStore]);

    const renderProps = React.useMemo(
        () => ({
            input: {
                name: store.name,
                value: store.state.value,
                onChange: methods.onChange,
                onBlur: methods.onBlur,
                onFocus: methods.onFocus,
                onDrop: methods.onDrop,
                parentOnUnmount: methods.parentOnUnmount,
            },
            arrayInput: {
                name: store.name,
                value: store.state.value,
                onItemAdd: methods.onItemAdd,
                onItemRemove: methods.onItemRemove,
                onDrop: methods.onDrop,
            },
            meta: {..._.omit(store.state, 'value'), submitFailed: store.tools.submitFailed},
        }),
        [methods, store.name, store.state, store.tools.submitFailed],
    );

    const withSearch = useSearch(store.spec, store.state.value, store.name);

    useControllerMirror(
        store.name,
        {
            useField: renderProps,
            useSearch: withSearch,
        } as ControllerMirror,
        __mirror,
    );

    React.useEffect(() => {
        store.afterStoreUpdateCB?.();
    }, [store.afterStoreUpdateCB]);

    React.useEffect(() => {
        if (!firstRenderRef.current) {
            updateStore({
                store,
                setStore,
                spec: _spec,
                name,
                parentOnChange,
                parentOnUnmount,
                mutatorsStore,
                config,
                tools,
                methodOnChange: fieldMethods.onChange,
                valueFromParent,
            });
        }
    }, [
        _spec,
        name,
        parentOnChange,
        parentOnUnmount,
        mutatorsStore,
        config,
        tools.onChange,
        tools.onUnmount,
    ]);

    React.useEffect(() => {
        firstRenderRef.current = false;

        return () => {
            callUnmout(store);
        };
    }, []);

    return withSearch(store.render(renderProps));
};
