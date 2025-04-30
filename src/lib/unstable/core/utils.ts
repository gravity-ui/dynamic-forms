import get from 'lodash/get';

import {JsonSchemaType} from './constants';
import type {JsonSchema} from './types';

export const parseFinalFormPath = (finalFormPath: string): string[] => {
    const result: string[] = [];
    const regex = /([^[.\]]+)|\[(\d+)\]/g;
    let match;

    while ((match = regex.exec(finalFormPath)) !== null) {
        if (match[1] !== undefined) {
            result.push(match[1]);
        } else if (match[2] !== undefined) {
            result.push(match[2]);
        }
    }

    return result;
};

export const getSchemaByFinalFormPath = (
    finalFormPath: string | string[],
    finalFormHeadPath: string,
    mainSchema: JsonSchema,
): JsonSchema | undefined => {
    if (finalFormPath.length) {
        return (Array.isArray(finalFormPath) ? finalFormPath : parseFinalFormPath(finalFormPath))
            .slice(parseFinalFormPath(finalFormHeadPath).length)
            .reduce((acc: JsonSchema | undefined, segment) => {
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
