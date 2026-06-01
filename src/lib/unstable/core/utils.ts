import {JsonSchemaType} from './constants';
import type {JsonSchema} from './types';

export const getSchemaType = (schema: JsonSchema): JsonSchemaType => {
    return schema.type || JsonSchemaType.Any;
};
