import React from 'react';

import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import values from 'lodash/values';
import {Field as FinalFormField, useForm} from 'react-final-form';

import type {AsyncValidateError, BaseValidateError, DynamicFieldStore, FieldValue} from '../types';
import {transformArrOut} from '../utils';

interface UseIntegrationFFParams {
    store: DynamicFieldStore;
    withoutDebounce?: boolean;
    destroyOnUnregister?: boolean;
    storeSubscriber?: (store: FieldValue) => void;
}

export const useIntegrationFF = ({
    store,
    withoutDebounce,
    destroyOnUnregister,
    storeSubscriber,
}: UseIntegrationFFParams) => {
    const form = useForm();

    const watcher = React.useMemo(() => {
        const props = {
            name: store.name,
            render: () => null,
            subscription: {},
            validate: () => {
                const asyncErrors: AsyncValidateError[] = [];
                let error: BaseValidateError;

                values(store.errors).forEach((err) => {
                    if (err) {
                        if (isFunction((err as AsyncValidateError)?.then)) {
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
            isEqual,
        };

        return <FinalFormField {...props} />;
    }, [store.name, store.errors]);

    const change = React.useMemo(() => {
        const cb = (value: FieldValue) => {
            if (store.name) {
                form.change(store.name, get(transformArrOut(value), store.name));
                storeSubscriber?.(get(value, store.name));
            }
        };

        if (withoutDebounce) {
            return cb;
        }

        return debounce(cb, 100);
    }, [form.change, store.name, withoutDebounce, storeSubscriber]);

    React.useEffect(() => {
        change(store.values);
    }, [store.values]);

    React.useEffect(() => {
        return () => {
            if (store.name && destroyOnUnregister) {
                form.change(store.name, undefined);
            }
        };
    }, []);

    return watcher;
};
