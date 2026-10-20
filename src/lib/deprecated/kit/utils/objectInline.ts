import type {Spec} from '../../core';
import {isBooleanSpec, isNumberSpec, isStringSpec} from '../../core';

/** @deprecated Use the SchemaRenderer API. */
export const filterPropertiesForObjectInline = (properties: Record<string, Spec>) => {
    return Object.fromEntries(
        Object.entries(properties).filter(
            ([, propSpec]) =>
                isStringSpec(propSpec) || isNumberSpec(propSpec) || isBooleanSpec(propSpec),
        ),
    );
};
