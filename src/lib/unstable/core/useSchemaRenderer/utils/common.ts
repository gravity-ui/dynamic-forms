import get from 'lodash/get';

import type {JsonSchema} from '../../types';

/**
 * Parses an AJV `schemaPath` (JSON Pointer) into an array of path segments
 * suitable for lodash `get`.
 *
 * Strips the `#/` prefix, decodes URI-encoded characters, splits on `/`,
 * and unescapes JSON Pointer tokens (`~1` → `/`, `~0` → `~`).
 *
 * Returns all segments unchanged; stripping a trailing validation keyword
 * (e.g. `minLength`) before lookup is the caller's responsibility.
 *
 * @param schemaPath - JSON Pointer string, e.g. `"#/properties/name/minLength"`.
 * @returns Path segments, e.g. `['properties', 'name', 'minLength']`.
 */
export const parseSchemaPath = (schemaPath: string): string[] => {
    return decodeURIComponent(schemaPath)
        .split('/')
        .slice(1)
        .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
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
 * Resolves a sub-schema from the root schema by an AJV `schemaPath`.
 *
 * Parses `schemaPath` via `parseSchemaPath` and looks up the node with lodash `get`.
 * The path must point to a schema object, not to a validation keyword — callers
 * should strip the trailing keyword first (see `processAjvError`).
 *
 * @param schemaPath - JSON Pointer string pointing to a schema node,
 *   e.g. `"#/properties/name"`.
 * @param schema - The root JSON schema object.
 *
 * @example
 * const nameSchema = {
 *   minLength: 5,
 * };
 * const objectSchema = {
 *   properties: {
 *     name: nameSchema,
 *   },
 * };
 * getSchemaBySchemaPath("#/properties/name", objectSchema); // returns nameSchema
 *
 * @returns The sub-schema at the given path, or the root schema when the path is empty.
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
    const schemaPath = getSchemaPath(parseInstancePath(instancePath), '', schema);

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
