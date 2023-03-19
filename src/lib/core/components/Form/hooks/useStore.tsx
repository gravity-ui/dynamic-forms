import React from 'react';

import _ from 'lodash';
import {Field as FinalFormField, useForm} from 'react-final-form';

import {transformArrIn, transformArrOut} from '../helpers';
import {
    AsyncValidateError,
    BaseValidateError,
    FieldObjectValue,
    FieldValue,
    ValidateError,
} from '../types';

export interface DynamicFieldStore {
    name: string;
    initialValue: FieldObjectValue;
    values: FieldObjectValue;
    errors: Record<string, ValidateError>;
}

export const useStore = (name: string) => {
    const form = useForm();
    const firstRenderRef = React.useRef(true);
    const [store, setStore] = React.useState<DynamicFieldStore>(() => {
        const initialValue: FieldObjectValue = transformArrIn({
            [name]: _.get(form.getState().values, name),
        });

        return {
            name,
            initialValue,
            values: _.cloneDeep(initialValue),
            errors: {},
        };
    });

    const submitFailed = form.getState().submitFailed;

    const watcher = React.useMemo(() => {
        const props = {
            name: store.name,
            render: () => null,
            subscription: {},
            validate: () => {
                const asyncErrors: AsyncValidateError[] = [];
                let error: BaseValidateError;

                _.values(store.errors).forEach((err) => {
                    if (err) {
                        if (_.isFunction((err as AsyncValidateError)?.then)) {
                            asyncErrors.push(err as AsyncValidateError);
                        } else {
                            error = err as BaseValidateError;
                        }
                    }
                });

                if (asyncErrors.length) {
                    return Promise.all(asyncErrors).then((r) => r[0]);
                }

                return error;
            },
        };

        return <FinalFormField {...props} />;
    }, [store.name, store.errors]);

    const tools = React.useMemo(
        () => ({
            initialValue: store.initialValue,
            onChange: (name: string, value: FieldValue, errors?: Record<string, ValidateError>) =>
                setStore((store) => ({
                    ...store,
                    values: _.set({...store.values}, name, value),
                    errors: errors || {},
                })),
            submitFailed,
        }),
        [store.initialValue, setStore, submitFailed],
    );

    const change = React.useCallback(
        _.debounce((value) => {
            form.change(store.name, _.get(transformArrOut(value), store.name));
        }, 100),
        [form.change, store.name],
    );

    React.useEffect(() => {
        change(store.values);
    }, [store.values]);

    React.useEffect(() => {
        if (!firstRenderRef.current) {
            const initialValue: FieldObjectValue = transformArrIn({
                [name]: _.get(form.getState().values, name),
            });

            setStore({
                name: name,
                initialValue,
                values: _.cloneDeep(initialValue),
                errors: {},
            });
        }
    }, [name]);

    React.useEffect(() => {
        firstRenderRef.current = false;
    }, []);

    return {tools, watcher};
};
