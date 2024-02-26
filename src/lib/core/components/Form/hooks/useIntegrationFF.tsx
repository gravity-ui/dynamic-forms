import React from 'react';

import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import values from 'lodash/values';
import {Field as FinalFormField, useForm} from 'react-final-form';

import {AsyncValidateError, BaseValidateError, DynamicFieldStore, FieldValue} from '../types';
import {transformArrOut} from '../utils';

export const useIntegrationFF = (store: DynamicFieldStore, withoutDebounce?: boolean) => {
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
        };

        return <FinalFormField {...props} />;
    }, [store.name, store.errors]);

    const change = React.useMemo(() => {
        const cb = (value: FieldValue) => {
            if (store.name) {
                form.change(store.name, get(transformArrOut(value), store.name));
            }
        };

        if (withoutDebounce) {
            return cb;
        }

        return debounce(cb, 100);
    }, [form.change, store.name, withoutDebounce]);

    React.useEffect(() => {
        change(store.values);
    }, [store.values]);

    React.useEffect(() => {
        return () => {
            if (store.name) {
                form.change(store.name, undefined);
            }
        };
    }, []);

    return watcher;
};
