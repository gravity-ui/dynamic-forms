import React from 'react';

import get from 'lodash/get';
import {type FieldRenderProps, type UseFieldConfig, useField} from 'react-final-form';

import {SchemaRendererContext} from '../SchemaRendererContext';
import {ARRAY_AND_OBJECT_ERRORS, JsonSchemaType, OBJECT_ERROR} from '../constants';
import {getSchemaByFinalFormPath, parseFinalFormPath} from '../utils';

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

    const {arraySchema, objectSchema} = React.useMemo(() => {
        const type = getSchemaByFinalFormPath(name, headName, mainSchema)?.type;

        return {
            arraySchema: type === JsonSchemaType.Array,
            objectSchema: type === JsonSchemaType.Object,
        };
    }, [headName, name, mainSchema]);

    const error = get(
        arraySchema || objectSchema
            ? get(serviceField.meta.error, ARRAY_AND_OBJECT_ERRORS)
            : serviceField.meta.error,
        objectSchema ? [...parseFinalFormPath(name), OBJECT_ERROR] : name,
    );

    return error ? {...field, meta: {...field.meta, error}} : field;
};
