import get from 'lodash/get';

import {JsonSchemaType} from '../../constants';
import type {JsonSchema} from '../../types';

/**
 * Extracts the path to the property from a JSON Schema validation error.
 * Assumes that the last segment in the `schemaPath` is the keyword
 * that triggered the validation error (e.g., "minLength").
 *
 * @param schemaPath - A JSON Pointer string representing the schema path,
 *   e.g., "#/properties/name/minLength"
 * @returns An array of path segments leading to the property, excluding the keyword,
 *   e.g., ['properties', 'name']
 */
export const parseSchemaPath = (schemaPath: string): string[] => {
    return decodeURIComponent(schemaPath)
        .slice('#/'.length)
        .split('/')
        .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'))
        .slice(0, -1);
};

export const parseInstancePath = (instancePath: string): string[] => {
    if (!instancePath.length) {
        return [];
    }

    return instancePath
        .slice('/'.length)
        .split('/')
        .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
};

/**
 * Retrieves the sub-schema from the main schema based on the given schema path.
 * Assumes that the last segment in the `schemaPath` is a validation keyword
 * (e.g., "minLength") and not part of the property path.
 *
 * @param schemaPath - A JSON Pointer-style string representing the schema path,
 *   e.g., "#/properties/name/minLength".
 * @param mainSchema - The root JSON schema object.
 *
 * @example
 * const nameSchema = {
 *   type: JsonSchemaType.String,
 *   minLength: 5,
 * };
 * const objectSchema = {
 *   type: JsonSchemaType.Object,
 *   properties: {
 *     name: nameSchema,
 *   },
 * };
 * getSchemaFromPath("#/properties/name/minLength", objectSchema); // returns nameSchema
 *
 * @returns The sub-schema object corresponding to the property path.
 */
export const getSchemaBySchemaPath = (
    schemaPath: string,
    mainSchema: JsonSchema,
): JsonSchema | undefined => {
    const pathArr = parseSchemaPath(schemaPath);

    if (!pathArr.length) {
        return mainSchema;
    }

    return get(mainSchema, pathArr);
};

export const getSchemaByInstancePath = (
    instancePath: string,
    mainSchema: JsonSchema,
): JsonSchema | undefined => {
    if (instancePath.length) {
        return parseInstancePath(instancePath).reduce((acc: JsonSchema | undefined, segment) => {
            const type = get(acc, 'type');

            if (type === JsonSchemaType.Object) {
                return get(acc, `properties.${segment}`);
            } else if (type === JsonSchemaType.Array) {
                const items = get(acc, 'items');

                if (Array.isArray(items)) {
                    return get(items, `[${segment}]`);
                }

                return items;
            }

            return undefined;
        }, mainSchema);
    }

    return mainSchema;
};

export const getValuePaths = (value: unknown, path: string[] = []) => {
    const result: string[][] = [];

    const isObject = (v: unknown): v is Record<string, unknown> =>
        v !== null && typeof v === 'object' && !Array.isArray(v);

    if (Array.isArray(value)) {
        value.forEach((_, index) => {
            result.push(...getValuePaths(value[index], [...path, `${index}`]));
        });
    } else if (isObject(value)) {
        Object.keys(value).forEach((key) => {
            result.push(...getValuePaths(get(value, key), [...path, key]));
        });
    } else if (path.length) {
        result.push(path);
    }

    return result;
};
