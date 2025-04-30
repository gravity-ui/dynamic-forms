import React from 'react';

import {useForm} from 'react-final-form';

import {SchemaRendererContext} from '../SchemaRendererContext';

import type {RemoveErrors, SetErrors, UseSetErrorsReturn} from './types';

export const useSetErrors = (): UseSetErrorsReturn => {
    const {serviceFieldName} = React.useContext(SchemaRendererContext);
    const mutators = useForm().mutators;

    const result = React.useMemo(() => {
        const setErrors: SetErrors = (params) => {
            mutators.setErrors({
                ...params,
                serviceFieldName,
            });
        };

        const removeErrors: RemoveErrors = (params) => {
            mutators.removeErrors({
                ...params,
                serviceFieldName,
            });
        };

        return {removeErrors, setErrors};
    }, [mutators.removeErrors, mutators.setErrors, serviceFieldName]);

    return result;
};
