import type {FormApi} from 'final-form';
import type {FieldMetaState} from 'react-final-form';

import type {EntityState, JsonSchemaArray} from '../../core';

export const getValidationState = (meta: FieldMetaState<any>): 'invalid' | undefined => {
    if ((meta.touched || meta.submitFailed) && meta.error) {
        return 'invalid';
    }

    return undefined;
};

export const getArrayItemParentName = (name: string) => name.slice(0, name.lastIndexOf('['));

export const getArrayItemIndex = (name: string) => name.slice(name.lastIndexOf('[') + 1, -1);

export const isArrayItem = (name: string) => name.endsWith(']');

export const isTupleItem = (name: string, form: FormApi) => {
    if (!isArrayItem(name)) {
        return false;
    }

    const parentName = getArrayItemParentName(name);
    const parentField = form.getFieldState(parentName);
    const parentSchema = (parentField?.data as EntityState<JsonSchemaArray>)?.schema;

    return Array.isArray(parentSchema?.items);
};
