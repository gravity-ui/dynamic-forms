import get from 'lodash/get';

import type {JsonSchema} from '../types';

/**
 * Parses a JSON Pointer into an array of path segments suitable for lodash `get`.
 *
 * Accepts fragment pointers (`#/…`) and document pointers (`/…`). Decodes
 * URI-encoded characters, splits on `/`, and unescapes JSON Pointer tokens
 * (`~1` → `/`, `~0` → `~`).
 *
 * An empty pointer (`#` or `''`) yields an empty array.
 *
 * @param pointer - JSON Pointer string, e.g. `"#/properties/name"`.
 * @returns Path segments, e.g. `['properties', 'name']`.
 */
export const pointerToArrayPath = (pointer: string): string[] => {
    return decodeURIComponent(pointer)
        .split('/')
        .slice(1)
        .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
};

/**
 * Parses a Final Form / lodash path (`a.b[0].c`) into an array of path segments.
 *
 * Object keys are split on `.`. Array indices in bracket notation (`[0]`)
 * become string segments (`'0'`).
 *
 * @param dotBracketPath - Dotted path with optional brackets, e.g. `"items[0].name"`.
 * @returns Path segments, e.g. `['items', '0', 'name']`.
 */
export const dotBracketToArrayPath = (dotBracketPath: string): string[] => {
    const result: string[] = [];
    const regex = /([^[.\]]+)|\[(\d+)\]/g;
    let match;

    while ((match = regex.exec(dotBracketPath)) !== null) {
        if (match[1] !== undefined) {
            result.push(match[1]);
        } else if (match[2] !== undefined) {
            result.push(match[2]);
        }
    }

    return result;
};

/**
 * Builds a Final Form / lodash path from an array of path segments.
 *
 * Numeric segments become bracket indices (`[0]`). Other segments are joined
 * with `.`.
 *
 * @param arrayPath - Path segments, e.g. `['items', '0', 'name']`.
 * @returns Dotted path with brackets, e.g. `"items[0].name"`.
 */
export const arrayPathToDotBracket = (arrayPath: string[]): string => {
    return arrayPath.reduce<string>((result, segment) => {
        if (/^\d+$/.test(segment)) {
            return `${result}[${segment}]`;
        }

        return result ? `${result}.${segment}` : segment;
    }, '');
};

/**
 * Resolves a sub-schema from the root schema by a JSON Pointer.
 *
 * A string pointer is parsed via `pointerToArrayPath`. An array of segments is
 * used as-is. Lookup is done with lodash `get`.
 *
 * @param schema - The root JSON schema object.
 * @param pointer - JSON Pointer (`"#/properties/name"`) or path segments
 *   (`['properties', 'name']`).
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
 * getSchemaByPointer(objectSchema, '#/properties/name'); // returns nameSchema
 *
 * @returns The sub-schema at the given path, or the root schema when the path is empty.
 */
export const getSchemaByPointer = (
    schema: JsonSchema,
    pointer: string | string[],
): JsonSchema | undefined => {
    const pathArr = Array.isArray(pointer) ? pointer : pointerToArrayPath(pointer);

    if (!pathArr.length) {
        return schema;
    }

    return get(schema, pathArr);
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

export const getServiceFieldName = (serviceFieldName: string, headName: string) =>
    headName ? `${serviceFieldName}.${headName}` : serviceFieldName;
