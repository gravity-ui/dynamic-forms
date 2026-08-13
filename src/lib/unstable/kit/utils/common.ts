import type {FormApi} from 'final-form';
import type {FieldMetaState} from 'react-final-form';

import {
    SCHEMA_RENDERER_SERVICE_FIELD,
    type SchemaNodeState,
    type SchemaRendererState,
    getSchemaBySchemaPath,
    getServiceFieldName,
} from '../../core';

export const getValidationState = (meta: FieldMetaState<any>): 'invalid' | undefined => {
    if ((meta.touched || meta.submitFailed) && meta.error) {
        return 'invalid';
    }

    return undefined;
};

export const getBooleanValidationState = (meta: FieldMetaState<any>): boolean => {
    return getValidationState(meta) === 'invalid';
};

export const getArrayItemParentName = (name: string) => name.slice(0, name.lastIndexOf('['));

export const getArrayItemIndex = (name: string) => name.slice(name.lastIndexOf('[') + 1, -1);

export const isArrayItem = (name: string) => name.endsWith(']');

export const isTupleItem = (name: string, headName: string, form: FormApi) => {
    if (!isArrayItem(name)) {
        return false;
    }

    const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);
    const srField = form.getFieldState(srName);
    const srState: SchemaRendererState | undefined = srField?.data?.state;
    const parentName = getArrayItemParentName(name);
    const parentField = form.getFieldState(parentName);
    const parentState: SchemaNodeState | undefined = parentField?.data?.state;

    if (!parentState || !srState) {
        return false;
    }

    const parentSchema = getSchemaBySchemaPath(srState.schema, parentState.schemaPath);

    return parentSchema && 'items' in parentSchema && Array.isArray(parentSchema.items);
};

export const isStringInt = (v: unknown): v is string => /^-?(0|[1-9][0-9]*)$/.test(`${v}`);

export const isStringFloat = (v: unknown): v is string =>
    /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(`${v}`);

export const isStringNumber = (v: unknown): v is string => isStringInt(v) || isStringFloat(v);
