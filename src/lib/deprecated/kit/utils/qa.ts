import isString from 'lodash/isString';

/**
 * The minimal structural shape the helper reads. Any instantiation of `Spec` / `ArraySpec` /
 * `BooleanSpec` / `NumberSpec` / `ObjectSpec` / `StringSpec` / `NumberWithScaleSpec`, with any
 * generic arguments, is assignable to it.
 */
export type QaSpecLike = {viewSpec?: {qa?: string}};

/**
 * Item Key of an array-item Field Name, or `undefined` if `name` is not an array item.
 * Form mode: `<array>.<KEY>` -> `KEY` (same marker as core `isArrayItem`).
 * Overview mode: `<array>[IDX]` -> `IDX`.
 */
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

/**
 * QA Base of a field: `name` when `spec.viewSpec.qa` is unset or empty,
 * `${qa}-${key}` for an array item, and `qa` verbatim otherwise.
 * Note: a property key that itself ends in `<…>` or `[digits]` is treated
 * as an array item only when its spec sets `qa`.
 */
export const getQaBase = (name: string, spec: QaSpecLike | undefined): string => {
    const qa = spec?.viewSpec?.qa;

    if (!isString(qa) || qa === '') {
        return name;
    }

    const key = getArrayItemKey(name);

    return key === undefined ? qa : `${qa}-${key}`;
};
