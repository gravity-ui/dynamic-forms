import isString from 'lodash/isString';

import {getArrayItemIndex, isArrayItem} from './common';

/** Minimal schema shape the helper reads; any `JsonSchema` variant is assignable to it. */
export type QaSchemaLike = {nodeParameters?: {qa?: string}};

// QA base: `name` if `nodeParameters.qa` is unset or '', `${qa}-${index}` for array items, else `qa`.
export const getQaBase = (name: string, schema: QaSchemaLike | undefined): string => {
    const qa = schema?.nodeParameters?.qa;

    if (!isString(qa) || qa === '') {
        return name;
    }

    return isArrayItem(name) ? `${qa}-${getArrayItemIndex(name)}` : qa;
};
