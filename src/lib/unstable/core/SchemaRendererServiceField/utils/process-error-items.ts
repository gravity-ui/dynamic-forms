import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

import {ARRAY_AND_OBJECT_ERRORS, JsonSchemaType} from '../../constants';
import type {JsonSchema, SyncValidateError} from '../../types';
import {getSchemaByFinalFormPath} from '../../utils';
import type {ValidateErrorItem} from '../types';

import {getValuePaths} from './common';

interface ProcessErrorItemsParams<Schema extends JsonSchema> {
    errorItems: ValidateErrorItem[];
    headName: string;
    mainSchema: Schema;
}

type ProcessErrorItemsReturn = {
    [ARRAY_AND_OBJECT_ERRORS]: {[key: string]: boolean | string | undefined};
} & {[key: string]: SyncValidateError};

export const processErrorItems = <Schema extends JsonSchema>({
    errorItems,
    headName,
    mainSchema,
}: ProcessErrorItemsParams<Schema>): ProcessErrorItemsReturn => {
    const result: ProcessErrorItemsReturn = {
        [ARRAY_AND_OBJECT_ERRORS]: {},
    };

    const setError = (path: string[], error: boolean | string | undefined) => {
        const itemSchema = getSchemaByFinalFormPath(path, headName, mainSchema);

        if (itemSchema) {
            const arrayOrObjectSchema =
                itemSchema.type === JsonSchemaType.Array ||
                itemSchema.type === JsonSchemaType.Object;

            if (arrayOrObjectSchema) {
                result[ARRAY_AND_OBJECT_ERRORS][path.join('.')] = error;
            } else {
                set(result, path, error);
            }
        }
    };

    errorItems.forEach((item) => {
        if (!item.error) {
            return;
        }

        if (isObjectLike(item.error)) {
            getValuePaths(item.error).forEach((path) => {
                setError([...item.path, ...path], get(item.error, path));
            });

            return;
        }

        if (isBoolean(item.error) || isString(item.error) || isUndefined(item.error)) {
            setError(item.path, item.error);

            return;
        }
    });

    return result;
};
