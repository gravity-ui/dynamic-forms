import React from 'react';

import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import omit from 'lodash/omit';
import set from 'lodash/set';
import {useFormState} from 'react-final-form';

import type {DynamicFieldStore, FieldObjectValue, FieldValue, ValidateError} from '../types';
import {transformArrIn} from '../utils';

export const useStore = (name: string) => {
    const formState = useFormState();
    const firstRenderRef = React.useRef(true);
    const [store, setStore] = React.useState<DynamicFieldStore>(() => {
        const values: FieldObjectValue = transformArrIn({
            [name]: get(formState.values, name),
        });

        const initialValue = transformArrIn({
            [name]: get(formState.initialValues, name),
        });

        return {
            name,
            initialValue: cloneDeep(initialValue),
            values: cloneDeep(values),
            errors: {},
        };
    });

    const submitFailed = formState.submitFailed;

    const tools = React.useMemo(
        () => ({
            initialValue: store.initialValue,
            onChange: (name: string, value: FieldValue, errors?: Record<string, ValidateError>) =>
                setStore((store) => ({
                    ...store,
                    values: set({...store.values}, name, clone(value)),
                    errors: errors || {},
                })),
            onUnmount: (name: string) =>
                setStore((store) => ({
                    ...store,
                    values: omit(store.values, name),
                    errors: omit(
                        store.errors,
                        Object.keys(store.errors).filter((key) => key.startsWith(name)),
                    ),
                })),
            submitFailed,
        }),
        [store.initialValue, setStore, submitFailed],
    );

    React.useEffect(() => {
        if (!firstRenderRef.current) {
            const values: FieldObjectValue = transformArrIn({
                [name]: get(formState.values, name),
            });

            const initialValue = transformArrIn({
                [name]: get(formState.initialValues, name),
            });

            setStore({
                name: name,
                initialValue: cloneDeep(initialValue),
                values: cloneDeep(values),
                errors: {},
            });
        }
    }, [name]);

    React.useEffect(() => {
        firstRenderRef.current = false;
    }, []);

    return {tools, store};
};
