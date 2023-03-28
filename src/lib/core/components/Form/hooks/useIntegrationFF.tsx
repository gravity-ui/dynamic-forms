import React from 'react';

import _ from 'lodash';
import debounce from 'lodash/debounce';
import {Field as FinalFormField, useForm} from 'react-final-form';

import {AsyncValidateError, BaseValidateError, DynamicFieldStore} from '../types';
import {transformArrOut} from '../utils';

export const useIntegrationFF = (store: DynamicFieldStore) => {
    const form = useForm();

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

    const change = React.useCallback(
        debounce((value) => {
            form.change(store.name, _.get(transformArrOut(value), store.name));
        }, 100),
        [form.change, store.name],
    );

    React.useEffect(() => {
        change(store.values);
    }, [store.values]);

    return watcher;
};
