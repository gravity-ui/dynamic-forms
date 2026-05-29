import get from 'lodash/get';

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

export const parseFinalFormName = (finalFormName: string): string[] => {
    const result: string[] = [];
    const regex = /([^[.\]]+)|\[(\d+)\]/g;
    let match;

    while ((match = regex.exec(finalFormName)) !== null) {
        if (match[1] !== undefined) {
            result.push(match[1]);
        } else if (match[2] !== undefined) {
            result.push(match[2]);
        }
    }

    return result;
};

export const formatFinalFormPath = (finalFormPath: string[]): string => {
    return finalFormPath.reduce<string>((result, segment) => {
        if (/^\d+$/.test(segment)) {
            return `${result}[${segment}]`;
        }

        return result ? `${result}.${segment}` : segment;
    }, '');
};

export const getSchemaPath = (
    finalFormNameOrPath: string | string[],
    finalFormHeadName: string,
    schema: JsonSchema,
): string[] | undefined => {
    const finalFormPath = Array.isArray(finalFormNameOrPath)
        ? finalFormNameOrPath
        : parseFinalFormName(finalFormNameOrPath);

    const schemaPath = finalFormPath
        .slice(parseFinalFormName(finalFormHeadName).length)
        .reduce((path: string[] | undefined, segment, index) => {
            if (path === undefined) {
                return path;
            }

            const schemaByPath: JsonSchema | undefined = index === 0 ? schema : get(schema, path);

            if (get(schemaByPath, ['properties', segment])) {
                return [...path, 'properties', segment];
            }

            const items = get(schemaByPath, 'items');

            if (items) {
                if (Array.isArray(items)) {
                    return [...path, 'items', segment];
                }

                return [...path, 'items'];
            }

            return undefined;
        }, []);

    return schemaPath;
};

/**
 * Retrieves the sub-schema from the main schema based on the given schema path.
 * Assumes that the last segment in the `schemaPath` is a validation keyword
 * (e.g., "minLength") and not part of the property path.
 *
 * @param schemaPath - A JSON Pointer-style string representing the schema path,
 *   e.g., "#/properties/name/minLength".
 * @param schema - The root JSON schema object.
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
    schema: JsonSchema,
): JsonSchema | undefined => {
    const pathArr = parseSchemaPath(schemaPath);

    if (!pathArr.length) {
        return schema;
    }

    return get(schema, pathArr);
};

export const getSchemaByInstancePath = (
    instancePath: string,
    schema: JsonSchema,
): JsonSchema | undefined => {
    const schemaPath = getSchemaPath(instancePath, '', schema);

    if (schemaPath) {
        return schemaPath.length ? get(schema, schemaPath) : schema;
    }

    return undefined;
};

export const getSchemaByFinalFormPath = (
    finalFormNameOrPath: string | string[],
    finalFormHeadName: string,
    schema: JsonSchema,
): JsonSchema | undefined => {
    const schemaPath = getSchemaPath(finalFormNameOrPath, finalFormHeadName, schema);

    if (schemaPath) {
        return schemaPath.length ? get(schema, schemaPath) : schema;
    }

    return undefined;
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
