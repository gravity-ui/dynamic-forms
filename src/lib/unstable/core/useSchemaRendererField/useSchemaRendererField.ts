import React from 'react';

import get from 'lodash/get';
import {type FieldRenderProps, type UseFieldConfig, useField} from 'react-final-form';

import {SchemaRendererContext} from '../SchemaRendererContext';
import {ARRAY_AND_OBJECT_ERRORS, JsonSchemaType} from '../constants';
import {getSchemaByFinalFormPath} from '../utils';

export const useSchemaRendererField = <
    FieldValue = any,
    T extends HTMLElement = HTMLElement,
    InputValue = FieldValue,
>(
    name: string,
    config?: UseFieldConfig<FieldValue, InputValue>,
): FieldRenderProps<FieldValue, T, InputValue> => {
    const {
        headName,
        schema: mainSchema,
        serviceFieldName,
    } = React.useContext(SchemaRendererContext);

    const field = useField(name, config);
    const serviceField = useField(serviceFieldName, {subscription: {error: true}});

    const arrayOrObjectSchema = React.useMemo(() => {
        const type = getSchemaByFinalFormPath(name, headName, mainSchema)?.type;

        return type === JsonSchemaType.Array || type === JsonSchemaType.Object;
    }, [headName, name, mainSchema]);

    const error = arrayOrObjectSchema
        ? get(serviceField.meta.error, [ARRAY_AND_OBJECT_ERRORS, name])
        : get(serviceField.meta.error, name);

    return error ? {...field, meta: {...field.meta, error}} : field;
};
