import isString from 'lodash/isString';

/** Minimal spec shape the helper reads; any `Spec` instantiation is assignable to it. */
export type QaSpecLike = {viewSpec?: {qa?: string}};

/** Item key of an array-item name: `arr.<KEY>` (form) or `arr[IDX]` (overview), else undefined. */
export const getArrayItemKey = (name: string): string | undefined => {
    const formMatch = /<([^<>]*)>$/.exec(name);

    if (formMatch) {
        return formMatch[1];
    }

    const overviewMatch = /\[(\d+)\]$/.exec(name);

    if (overviewMatch) {
        return overviewMatch[1];
    }

    return undefined;
};

// QA base: `name` if `viewSpec.qa` is unset or '', `${qa}-${key}` for array items, else `qa`.
// A property key ending in `<…>` or `[digits]` counts as an array item only when `qa` is set.
export const getQaBase = (name: string, spec: QaSpecLike | undefined): string => {
    const qa = spec?.viewSpec?.qa;

    if (!isString(qa) || qa === '') {
        return name;
    }

    const key = getArrayItemKey(name);

    return key === undefined ? qa : `${qa}-${key}`;
};
