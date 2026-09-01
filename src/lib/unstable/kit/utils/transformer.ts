/* eslint-disable complexity */

import get from 'lodash/get';
import set from 'lodash/set';

import {
    type ArraySpec,
    type BooleanSpec,
    type NumberSpec,
    type NumberWithScaleSpec,
    type ObjectSpec,
    type Spec,
    type StringSpec,
    isArraySpec,
    isBooleanSpec,
    isNumberSpec,
    isObjectSpec,
    isStringSpec,
} from '../../../core';
import {type JsonSchema, type JsonSchemaAny, JsonSchemaType, NodeType} from '../../core';

export const layoutRules: Record<
    string,
    (spec: Spec, mutableSchema: JsonSchema, ctx?: SpecToJsonSchemaContenxt) => void
> = {
    row: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'row');
    },
    row_verbose: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'row');
        set(mutableSchema, 'nodeParameters.layoutProps.descriptionType', 'bottom');
    },
    column: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'column');
    },
    accordeon: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'accordeon');
        set(mutableSchema, 'nodeParameters.layoutProps.togglerProps.view', 'clear');
        set(mutableSchema, 'nodeParameters.layoutProps.withIndent', true);
    },
    section: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'section');
        set(mutableSchema, 'nodeParameters.layoutProps.variant', 'subheader-2');
    },
    section2: (_spec, mutableSchema) => {
        // the new section title default (subheader-1) matches the old section2 title size
        set(mutableSchema, 'nodeParameters.layout', 'section');
    },
    group: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'section');
        set(mutableSchema, 'nodeParameters.layoutProps.variant', 'subheader-2');
        set(mutableSchema, 'nodeParameters.layoutProps.withIndent', true);
    },
    group2: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'section');
        set(mutableSchema, 'nodeParameters.layoutProps.withIndent', true);
    },
    table_item: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'cell');
    },
    transparent: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'transparent');
    },
    card_accordeon: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'card');
        set(mutableSchema, 'nodeParameters.layoutProps.likeAccordeon', true);
    },
    card_section: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'card');
        set(mutableSchema, 'nodeParameters.layoutProps.likeAccordeon', false);
    },
    accordeon_card: (_spec, mutableSchema) => {
        set(mutableSchema, 'nodeParameters.layout', 'card');
        set(mutableSchema, 'nodeParameters.layoutProps.likeAccordeon', true);
    },
};

export const arrayInputTypeRules: Record<
    string,
    (spec: ArraySpec, mutableSchema: JsonSchema, ctx?: SpecToJsonSchemaContenxt) => void
> = {
    select: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Array);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maxLength) {
            const maxItems = Number(spec.maxLength);

            if (!isNaN(maxItems)) {
                set(mutableSchema, 'maxItems', maxItems);
            }
        }

        if (spec.minLength) {
            const minItems = Number(spec.minLength);

            if (!isNaN(minItems)) {
                set(mutableSchema, 'minItems', minItems);
            }
        }

        if (spec.enum) {
            set(mutableSchema, 'items.enum', spec.enum);
        }

        // items for old select not expected
        // if (spec.items) {}

        if (spec.description) {
            set(mutableSchema, 'nodeParameters.entityProps.enumDescriptions', spec.description);
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Array);
        set(mutableSchema, 'nodeParameters.entity', 'select');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        // itemLabel for old select not expected
        // if (spec.viewSpec.itemLabel) {}

        // itemPrefix for old select not expected
        // if (spec.viewSpec.itemPrefix) {}

        // table for old select not expected
        // if (spec.viewSpec.table) {}

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown array select view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(mutableSchema, 'nodeParameters.entityProps.placeholder', spec.viewSpec.placeholder);
        }

        // addButtonPosition for old select not expected
        // if (spec.viewSpec.addButtonPosition) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown array select view spec key: "hidden"`);
        }

        if (spec.viewSpec.selectParams) {
            if (spec.viewSpec.selectParams.filterPlaceholder) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.filterPlaceholder',
                    spec.viewSpec.selectParams.filterPlaceholder,
                );
            }

            if (spec.viewSpec.selectParams.meta) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.optionsMeta',
                    spec.viewSpec.selectParams.meta,
                );
            }
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // checkboxGroupParams for old select not expected
        // if (spec.viewSpec.checkboxGroupParams) {}
    },
    table: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Array);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maxLength) {
            const maxItems = Number(spec.maxLength);

            if (!isNaN(maxItems)) {
                set(mutableSchema, 'maxItems', maxItems);
            }
        }

        if (spec.minLength) {
            const minItems = Number(spec.minLength);

            if (!isNaN(minItems)) {
                set(mutableSchema, 'minItems', minItems);
            }
        }

        // enum for old table not expected
        // if (spec.enum) {}

        if (spec.items && isObjectSpec(spec.items)) {
            Object.entries(spec.items.properties || {}).forEach(([key, value]) => {
                set(
                    mutableSchema,
                    ['items', 'properties', key],
                    specToJsonSchema(
                        value as Spec,
                        get(mutableSchema, ['items', 'properties', key]) as
                            | JsonSchemaAny
                            | undefined,
                    ),
                );
            });
        }

        // description for old table not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Array);
        set(mutableSchema, 'nodeParameters.entity', 'table');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.itemLabel) {
            set(mutableSchema, 'nodeParameters.entityProps.addButtonText', spec.viewSpec.itemLabel);
        }

        // itemPrefix for old table not expected
        // if (spec.viewSpec.itemPrefix) {}

        if (spec.viewSpec.table) {
            const order: string[] = [];

            spec.viewSpec.table.forEach(({description, label, property, width}) => {
                order.push(property);

                if (label) {
                    set(mutableSchema, ['items', 'properties', property, 'title'], label);
                }

                if (description) {
                    set(
                        mutableSchema,
                        ['items', 'properties', property, 'description'],
                        description,
                    );
                }

                if (width !== undefined && process.env.NODE_ENV !== 'production') {
                    console.warn(
                        `[dynamic-forms] Unknown array table view spec key: "table[].width", value - ${width}`,
                    );
                }
            });

            set(mutableSchema, 'nodeParameters.entityProps.order', order);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown array table view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // placeholder for old table not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.addButtonPosition && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown array table view spec key: "addButtonPosition", value - ${spec.viewSpec.addButtonPosition}`,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown array table view spec key: "hidden"`);
        }

        // selectParams for old table not expected
        // if (spec.viewSpec.selectParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // checkboxGroupParams for old table not expected
        // if (spec.viewSpec.checkboxGroupParams) {}
    },
    base: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Array);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maxLength) {
            const maxItems = Number(spec.maxLength);

            if (!isNaN(maxItems)) {
                set(mutableSchema, 'maxItems', maxItems);
            }
        }

        if (spec.minLength) {
            const minItems = Number(spec.minLength);

            if (!isNaN(minItems)) {
                set(mutableSchema, 'minItems', minItems);
            }
        }

        // enum for old base not expected
        // if (spec.enum) {}

        if (spec.items) {
            set(
                mutableSchema,
                'items',
                specToJsonSchema(
                    spec.items,
                    get(mutableSchema, 'items') as JsonSchemaAny | undefined,
                ),
            );
        }

        // description for old base not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Array);
        set(mutableSchema, 'nodeParameters.entity', 'base');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.itemLabel) {
            set(mutableSchema, 'nodeParameters.entityProps.addButtonText', spec.viewSpec.itemLabel);
        }

        if (spec.viewSpec.itemPrefix && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown array base view spec key: "itemPrefix", value - ${spec.viewSpec.itemPrefix}`,
            );
        }

        // table for old base not expected
        // if (spec.viewSpec.table) {}

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown array base view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // placeholder for old base not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.addButtonPosition && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown array base view spec key: "addButtonPosition", value - ${spec.viewSpec.addButtonPosition}`,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown array base view spec key: "hidden"`);
        }

        // selectParams for old base not expected
        // if (spec.viewSpec.selectParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // checkboxGroupParams for old base not expected
        // if (spec.viewSpec.checkboxGroupParams) {}
    },
    checkbox_group: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Array);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maxLength) {
            const maxItems = Number(spec.maxLength);

            if (!isNaN(maxItems)) {
                set(mutableSchema, 'maxItems', maxItems);
            }
        }

        if (spec.minLength) {
            const minItems = Number(spec.minLength);

            if (!isNaN(minItems)) {
                set(mutableSchema, 'minItems', minItems);
            }
        }

        if (spec.enum) {
            set(mutableSchema, 'items.enum', spec.enum);
        }

        // items for old checkbox_group not expected
        // if (spec.items) {}

        if (spec.description) {
            set(mutableSchema, 'nodeParameters.entityProps.enumDescriptions', spec.description);
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Array);
        set(mutableSchema, 'nodeParameters.entity', 'checkbox_group');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        // itemLabel for old checkbox_group not expected
        // if (spec.viewSpec.itemLabel) {}

        // itemPrefix for old checkbox_group not expected
        // if (spec.viewSpec.itemPrefix) {}

        // table for old checkbox_group not expected
        // if (spec.viewSpec.table) {}

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown array checkbox_group view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // placeholder for old checkbox_group not expected
        // if (spec.viewSpec.placeholder) {}

        // addButtonPosition for old checkbox_group not expected
        // if (spec.viewSpec.addButtonPosition) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown array checkbox_group view spec key: "hidden"`);
        }

        // selectParams for old checkbox_group not expected
        // if (spec.viewSpec.selectParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        if (spec.viewSpec.checkboxGroupParams) {
            if (spec.viewSpec.checkboxGroupParams.placement) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.direction',
                    spec.viewSpec.checkboxGroupParams.placement === 'vertical' ? 'column' : 'row',
                );
            }

            if (spec.viewSpec.checkboxGroupParams.disabled) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.optionsDisabled',
                    spec.viewSpec.checkboxGroupParams.disabled,
                );
            }
        }
    },
};

export const booleanInputTypeRules: Record<
    string,
    (spec: BooleanSpec, mutableSchema: JsonSchema, ctx?: SpecToJsonSchemaContenxt) => void
> = {
    base: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Boolean);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Boolean);
        set(mutableSchema, 'nodeParameters.entity', 'base');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown boolean base view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown boolean base view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        if (spec.viewSpec.viewColor) {
            set(
                mutableSchema,
                'nodeParameters.overviewEntityProps.viewColor',
                spec.viewSpec.viewColor,
            );
        }
    },
    switch: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Boolean);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Boolean);
        set(mutableSchema, 'nodeParameters.entity', 'switch');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown boolean switch view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown boolean switch view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        if (spec.viewSpec.viewColor) {
            set(
                mutableSchema,
                'nodeParameters.overviewEntityProps.viewColor',
                spec.viewSpec.viewColor,
            );
        }
    },
};

export const numberInputTypeRules: Record<
    string,
    (spec: NumberSpec, mutableSchema: JsonSchema, ctx?: SpecToJsonSchemaContenxt) => void
> = {
    base: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Number);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maximum !== undefined) {
            const maximum = Number(spec.maximum);

            if (!isNaN(maximum)) {
                set(mutableSchema, 'maximum', maximum);
            }
        }

        if (spec.minimum !== undefined) {
            const minimum = Number(spec.minimum);

            if (!isNaN(minimum)) {
                set(mutableSchema, 'minimum', minimum);
            }
        }

        if (spec.format === 'int64') {
            set(mutableSchema, 'type', JsonSchemaType.Integer);
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Number);
        set(mutableSchema, 'nodeParameters.entity', 'base');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown number base view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(mutableSchema, 'nodeParameters.entityProps.placeholder', spec.viewSpec.placeholder);
        }

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown number base view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }
    },
    range_input_picker: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Number);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maximum !== undefined) {
            const maximum = Number(spec.maximum);

            if (!isNaN(maximum)) {
                set(mutableSchema, 'maximum', maximum);
            }
        }

        if (spec.minimum !== undefined) {
            const minimum = Number(spec.minimum);

            if (!isNaN(minimum)) {
                set(mutableSchema, 'minimum', minimum);
            }
        }

        if (spec.format === 'int64') {
            set(mutableSchema, 'type', JsonSchemaType.Integer);
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Number);
        set(mutableSchema, 'nodeParameters.entity', 'slider');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown number range_input_picker view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown number range_input_picker view spec key: "placeholder", value - ${spec.viewSpec.placeholder}`,
            );
        }

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown number range_input_picker view spec key: "hidden"`,
            );
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }
    },
};

export const objectInputTypeRules: Record<
    string,
    (spec: ObjectSpec, mutableSchema: JsonSchema, ctx?: SpecToJsonSchemaContenxt) => void
> = {
    oneof: (spec, mutableSchema) => {
        const booleanToggler =
            spec.viewSpec.oneOfParams?.toggler === 'checkbox' ||
            spec.viewSpec.oneOfParams?.toggler === 'switch';

        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );

                if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                    set(
                        mutableSchema,
                        ['properties', key, 'nodeParameters', 'layout'],
                        'transparent',
                    );
                }
            });

            if (!booleanToggler) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.enum',
                    Object.keys(spec.properties),
                );
            }
        }

        if (spec.description) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                spec.description,
            );
        } else {
            const enumDescriptions = Object.fromEntries(
                Object.entries(spec.properties || {}).map(([key, value]) => [
                    key,
                    value.viewSpec.layoutTitle || key,
                ]),
            );

            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                enumDescriptions,
            );
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        set(mutableSchema, 'nodeParameters.entity', 'one_of_nested');
        set(mutableSchema, 'nodeParameters.entityProps.withIndent', true);

        if (booleanToggler) {
            set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.Boolean);
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.type',
                NodeType.Boolean,
            );
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entity',
                spec.viewSpec.oneOfParams?.toggler === 'switch' ? 'switch' : 'base',
            );
        } else {
            set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.String);
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.type',
                NodeType.String,
            );
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entity',
                spec.viewSpec.oneOfParams?.toggler === 'radio'
                    ? 'radio_group'
                    : 'segmented_radio_group',
            );
        }

        set(mutableSchema, 'nodeParameters.layout', 'transparent');
        set(mutableSchema, 'nodeParameters.entityProps.toggler.nodeParameters.layout', 'row');

        if (spec.viewSpec.layoutTitle) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.title',
                spec.viewSpec.layoutTitle,
            );
        }

        if (spec.viewSpec.layoutDescription) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.description',
                spec.viewSpec.layoutDescription,
            );
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order && !booleanToggler) {
            set(mutableSchema, 'nodeParameters.entityProps.toggler.enum', spec.viewSpec.order);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object oneof view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.oneOfParams?.booleanMap) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.booleanToKey',
                spec.viewSpec.oneOfParams.booleanMap,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                spec.viewSpec.placeholder,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object oneof view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // delimiter for old oneof not expected
        // if (spec.viewSpec.delimiter) {}
    },
    oneof_flat: (spec, mutableSchema) => {
        const booleanToggler =
            spec.viewSpec.oneOfParams?.toggler === 'checkbox' ||
            spec.viewSpec.oneOfParams?.toggler === 'switch';

        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );

                if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                    set(
                        mutableSchema,
                        ['properties', key, 'nodeParameters', 'layout'],
                        'transparent',
                    );
                }
            });

            if (!booleanToggler) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.enum',
                    Object.keys(spec.properties),
                );
            }
        }

        if (spec.description) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                spec.description,
            );
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        set(mutableSchema, 'nodeParameters.entity', 'one_of_nested');

        if (booleanToggler) {
            set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.Boolean);
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.type',
                NodeType.Boolean,
            );
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entity',
                spec.viewSpec.oneOfParams?.toggler === 'switch' ? 'switch' : 'base',
            );
        } else {
            set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.String);
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.type',
                NodeType.String,
            );
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entity',
                spec.viewSpec.oneOfParams?.toggler === 'radio'
                    ? 'radio_group'
                    : 'segmented_radio_group',
            );
        }

        set(mutableSchema, 'nodeParameters.layout', 'transparent');
        set(mutableSchema, 'nodeParameters.entityProps.toggler.nodeParameters.layout', 'row');

        if (spec.viewSpec.layoutTitle) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.title',
                spec.viewSpec.layoutTitle,
            );
        }

        if (spec.viewSpec.layoutDescription) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.description',
                spec.viewSpec.layoutDescription,
            );
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order && !booleanToggler) {
            set(mutableSchema, 'nodeParameters.entityProps.toggler.enum', spec.viewSpec.order);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object oneof_flat view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.oneOfParams?.booleanMap) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.booleanToKey',
                spec.viewSpec.oneOfParams.booleanMap,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                spec.viewSpec.placeholder,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object oneof_flat view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // delimiter for old oneof_flat not expected
        // if (spec.viewSpec.delimiter) {}
    },
    card_oneof: (spec, mutableSchema) => {
        const booleanToggler =
            spec.viewSpec.oneOfParams?.toggler === 'checkbox' ||
            spec.viewSpec.oneOfParams?.toggler === 'switch';

        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );

                if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                    set(
                        mutableSchema,
                        ['properties', key, 'nodeParameters', 'layout'],
                        'transparent',
                    );
                }
            });

            if (!booleanToggler) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.enum',
                    Object.keys(spec.properties),
                );
            }
        }

        if (spec.description) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                spec.description,
            );
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        set(mutableSchema, 'nodeParameters.entity', 'one_of_nested');

        if (booleanToggler) {
            set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.Boolean);
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.type',
                NodeType.Boolean,
            );
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entity',
                spec.viewSpec.oneOfParams?.toggler === 'switch' ? 'switch' : 'base',
            );
        } else {
            set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.String);
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.type',
                NodeType.String,
            );
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entity',
                spec.viewSpec.oneOfParams?.toggler === 'select'
                    ? 'select'
                    : 'segmented_radio_group',
            );
        }

        set(mutableSchema, 'nodeParameters.layout', 'card');
        set(mutableSchema, 'nodeParameters.entityProps.toggler.nodeParameters.layout', 'row');

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.title',
                spec.viewSpec.layoutTitle,
            );
        }

        if (spec.viewSpec.layoutDescription) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.description',
                spec.viewSpec.layoutDescription,
            );
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order && !booleanToggler) {
            set(mutableSchema, 'nodeParameters.entityProps.toggler.enum', spec.viewSpec.order);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object card_oneof view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.oneOfParams?.booleanMap) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.booleanToKey',
                spec.viewSpec.oneOfParams.booleanMap,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                spec.viewSpec.placeholder,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object card_oneof view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // delimiter for old card_oneof not expected
        // if (spec.viewSpec.delimiter) {}
    },
    secret: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );
            });
        }

        // description for old secret not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        // there is no secret entity in the new kit yet, the name is kept as is
        set(mutableSchema, 'nodeParameters.entity', 'secret');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order) {
            set(mutableSchema, 'nodeParameters.entityProps.order', spec.viewSpec.order);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object secret view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // oneOfParams for old secret not expected
        // if (spec.viewSpec.oneOfParams) {}

        // placeholder for old secret not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object secret view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // delimiter for old secret not expected
        // if (spec.viewSpec.delimiter) {}
    },
    base: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );
            });
        }

        // description for old base not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        set(mutableSchema, 'nodeParameters.entity', 'base');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order) {
            set(mutableSchema, 'nodeParameters.entityProps.order', spec.viewSpec.order);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object base view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // oneOfParams for old base not expected
        // if (spec.viewSpec.oneOfParams) {}

        // placeholder for old base not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object base view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        if (spec.viewSpec.delimiter && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object base view spec key: "delimiter", value - ${JSON.stringify(
                    spec.viewSpec.delimiter,
                    null,
                    2,
                )}`,
            );
        }
    },
    text_link: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );
            });
        }

        // description for old text_link not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        // there is no text_link entity in the new kit yet, the name is kept as is
        set(mutableSchema, 'nodeParameters.entity', 'text_link');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        // order for old text_link not expected
        // if (spec.viewSpec.order) {}

        if (spec.viewSpec.link) {
            set(mutableSchema, 'nodeParameters.entityProps.link', spec.viewSpec.link);
        }

        // oneOfParams for old text_link not expected
        // if (spec.viewSpec.oneOfParams) {}

        // placeholder for old text_link not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object text_link view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // delimiter for old text_link not expected
        // if (spec.viewSpec.delimiter) {}
    },
    object_value: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );
            });
        }

        // description for old object_value not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        set(mutableSchema, 'nodeParameters.entity', 'dot_value');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object object_value view spec key: "order", value - ${JSON.stringify(
                    spec.viewSpec.order,
                )}`,
            );
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object object_value view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // oneOfParams for old object_value not expected
        // if (spec.viewSpec.oneOfParams) {}

        // placeholder for old object_value not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object object_value view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // delimiter for old object_value not expected
        // if (spec.viewSpec.delimiter) {}
    },
    multi_oneof: (spec, mutableSchema) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );

                if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                    set(
                        mutableSchema,
                        ['properties', key, 'nodeParameters', 'layout'],
                        'transparent',
                    );
                }
            });

            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.items.enum',
                Object.keys(spec.properties),
            );
        }

        if (spec.description) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                spec.description,
            );
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        set(mutableSchema, 'nodeParameters.entity', 'few_of_nested');
        set(mutableSchema, 'nodeParameters.entityProps.withIndent', true);
        set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.Array);
        set(
            mutableSchema,
            'nodeParameters.entityProps.toggler.nodeParameters.type',
            NodeType.Array,
        );
        set(
            mutableSchema,
            'nodeParameters.entityProps.toggler.nodeParameters.entity',
            spec.viewSpec.oneOfParams?.toggler === 'checkbox' ? 'checkbox_group' : 'select',
        );

        set(mutableSchema, 'nodeParameters.layout', 'transparent');
        set(mutableSchema, 'nodeParameters.entityProps.toggler.nodeParameters.layout', 'row');

        if (spec.viewSpec.layoutTitle) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.title',
                spec.viewSpec.layoutTitle,
            );
        }

        if (spec.viewSpec.layoutDescription) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.description',
                spec.viewSpec.layoutDescription,
            );
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.items.enum',
                spec.viewSpec.order,
            );
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object multi_oneof view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.oneOfParams?.booleanMap && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object multi_oneof view spec key: "oneOfParams.booleanMap", value - ${JSON.stringify(
                    spec.viewSpec.oneOfParams.booleanMap,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                spec.viewSpec.placeholder,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object multi_oneof view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // delimiter for old multi_oneof not expected
        // if (spec.viewSpec.delimiter) {}
    },
    multi_oneof_flat: (spec, mutableSchema) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );

                if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                    set(
                        mutableSchema,
                        ['properties', key, 'nodeParameters', 'layout'],
                        'transparent',
                    );
                }
            });

            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.items.enum',
                Object.keys(spec.properties),
            );
        }

        if (spec.description) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                spec.description,
            );
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        set(mutableSchema, 'nodeParameters.entity', 'few_of_nested');
        set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.Array);
        set(
            mutableSchema,
            'nodeParameters.entityProps.toggler.nodeParameters.type',
            NodeType.Array,
        );
        set(
            mutableSchema,
            'nodeParameters.entityProps.toggler.nodeParameters.entity',
            spec.viewSpec.oneOfParams?.toggler === 'checkbox' ? 'checkbox_group' : 'select',
        );

        set(mutableSchema, 'nodeParameters.layout', 'transparent');
        set(mutableSchema, 'nodeParameters.entityProps.toggler.nodeParameters.layout', 'row');

        if (spec.viewSpec.layoutTitle) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.title',
                spec.viewSpec.layoutTitle,
            );
        }

        if (spec.viewSpec.layoutDescription) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.description',
                spec.viewSpec.layoutDescription,
            );
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.items.enum',
                spec.viewSpec.order,
            );
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object multi_oneof_flat view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.oneOfParams?.booleanMap && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object multi_oneof_flat view spec key: "oneOfParams.booleanMap", value - ${JSON.stringify(
                    spec.viewSpec.oneOfParams.booleanMap,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                spec.viewSpec.placeholder,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object multi_oneof_flat view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // delimiter for old multi_oneof_flat not expected
        // if (spec.viewSpec.delimiter) {}
    },
    inline: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );
            });
        }

        // description for old inline not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        set(mutableSchema, 'nodeParameters.entity', 'inline');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order) {
            set(mutableSchema, 'nodeParameters.entityProps.order', spec.viewSpec.order);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object inline view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // oneOfParams for old inline not expected
        // if (spec.viewSpec.oneOfParams) {}

        // placeholder for old inline not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown object inline view spec key: "hidden"`);
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        if (spec.viewSpec.delimiter) {
            set(mutableSchema, 'nodeParameters.entityProps.delimiter', spec.viewSpec.delimiter);
        }
    },
    time_range_selector: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );
            });
        }

        // description for old time_range_selector not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        // there is no time_range_selector entity in the new kit yet, the name is kept as is
        set(mutableSchema, 'nodeParameters.entity', 'time_range_selector');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order) {
            set(mutableSchema, 'nodeParameters.entityProps.order', spec.viewSpec.order);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object time_range_selector view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // oneOfParams for old time_range_selector not expected
        // if (spec.viewSpec.oneOfParams) {}

        if (spec.viewSpec.placeholder) {
            set(mutableSchema, 'nodeParameters.entityProps.placeholder', spec.viewSpec.placeholder);
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object time_range_selector view spec key: "hidden"`,
            );
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // delimiter for old time_range_selector not expected
        // if (spec.viewSpec.delimiter) {}
    },
    range_input_picker: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.Object);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                set(
                    mutableSchema,
                    ['properties', key],
                    specToJsonSchema(
                        childSpec,
                        get(mutableSchema, ['properties', key]) as JsonSchemaAny,
                    ),
                );
            });
        }

        // description for old range_input_picker not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Object);
        set(mutableSchema, 'nodeParameters.entity', 'range_input');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.order) {
            if (spec.viewSpec.order.length === 2) {
                set(mutableSchema, 'nodeParameters.entityProps.propertyKeys', spec.viewSpec.order);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    `[dynamic-forms] Unknown object range_input_picker view spec key: "order", value - ${JSON.stringify(
                        spec.viewSpec.order,
                    )}`,
                );
            }
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object range_input_picker view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // oneOfParams for old range_input_picker not expected
        // if (spec.viewSpec.oneOfParams) {}

        // placeholder for old range_input_picker not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object range_input_picker view spec key: "hidden"`,
            );
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        if (spec.viewSpec.delimiter && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown object range_input_picker view spec key: "delimiter", value - ${JSON.stringify(
                    spec.viewSpec.delimiter,
                )}`,
            );
        }
    },
};

export const stringInputTypeRules: Record<
    string,
    (spec: StringSpec, mutableSchema: JsonSchema, ctx?: SpecToJsonSchemaContenxt) => void
> = {
    password: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maxLength) {
            const maxLength = Number(spec.maxLength);

            if (!isNaN(maxLength)) {
                set(mutableSchema, 'maxLength', maxLength);
            }
        }

        if (spec.minLength) {
            const minLength = Number(spec.minLength);

            if (!isNaN(minLength)) {
                set(mutableSchema, 'minLength', minLength);
            }
        }

        if (spec.pattern) {
            set(mutableSchema, 'pattern', spec.pattern);
        }

        if (spec.patternError) {
            set(mutableSchema, 'nodeParameters.errorMessages.pattern', spec.patternError);
        }

        // enum for old password not expected
        // if (spec.enum) {}

        // description for old password not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'password');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string password view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old password not expected
        // if (spec.viewSpec.sizeParams) {}

        // monacoParams for old password not expected
        // if (spec.viewSpec.monacoParams) {}

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string password view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(mutableSchema, 'nodeParameters.entityProps.placeholder', spec.viewSpec.placeholder);
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string password view spec key: "hidden"`);
        }

        // textContentParams for old password not expected
        // if (spec.viewSpec.textContentParams) {}

        // fileInput for old password not expected
        // if (spec.viewSpec.fileInput) {}

        // dateInput for old password not expected
        // if (spec.viewSpec.dateInput) {}

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        // selectParams for old password not expected
        // if (spec.viewSpec.selectParams) {}

        // radioGroupParams for old password not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        if (spec.viewSpec.generateRandomValueButton && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string password view spec key: "generateRandomValueButton"`,
            );
        }
    },
    textarea: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maxLength) {
            const maxLength = Number(spec.maxLength);

            if (!isNaN(maxLength)) {
                set(mutableSchema, 'maxLength', maxLength);
            }
        }

        if (spec.minLength) {
            const minLength = Number(spec.minLength);

            if (!isNaN(minLength)) {
                set(mutableSchema, 'minLength', minLength);
            }
        }

        if (spec.pattern) {
            set(mutableSchema, 'pattern', spec.pattern);
        }

        if (spec.patternError) {
            set(mutableSchema, 'nodeParameters.errorMessages.pattern', spec.patternError);
        }

        // enum for old textarea not expected
        // if (spec.enum) {}

        // description for old textarea not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'textarea');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string textarea view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old textarea not expected
        // if (spec.viewSpec.sizeParams) {}

        // monacoParams for old textarea not expected
        // if (spec.viewSpec.monacoParams) {}

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string textarea view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(mutableSchema, 'nodeParameters.entityProps.placeholder', spec.viewSpec.placeholder);
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string textarea view spec key: "hidden"`);
        }

        // textContentParams for old textarea not expected
        // if (spec.viewSpec.textContentParams) {}

        // fileInput for old textarea not expected
        // if (spec.viewSpec.fileInput) {}

        // dateInput for old textarea not expected
        // if (spec.viewSpec.dateInput) {}

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        // selectParams for old textarea not expected
        // if (spec.viewSpec.selectParams) {}

        // radioGroupParams for old textarea not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        if (spec.viewSpec.generateRandomValueButton && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string textarea view spec key: "generateRandomValueButton"`,
            );
        }
    },
    select: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        // maxLength for old select not expected
        // if (spec.maxLength) {}

        // minLength for old select not expected
        // if (spec.minLength) {}

        // pattern for old select not expected
        // if (spec.pattern) {}

        // patternError for old select not expected
        // if (spec.patternError) {}

        if (spec.enum) {
            set(mutableSchema, 'enum', spec.enum);
        }

        if (spec.description) {
            set(mutableSchema, 'nodeParameters.entityProps.enumDescriptions', spec.description);
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'select');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string select view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old select not expected
        // if (spec.viewSpec.sizeParams) {}

        // monacoParams for old select not expected
        // if (spec.viewSpec.monacoParams) {}

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string select view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(mutableSchema, 'nodeParameters.entityProps.placeholder', spec.viewSpec.placeholder);
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string select view spec key: "hidden"`);
        }

        // textContentParams for old select not expected
        // if (spec.viewSpec.textContentParams) {}

        // fileInput for old select not expected
        // if (spec.viewSpec.fileInput) {}

        // dateInput for old select not expected
        // if (spec.viewSpec.dateInput) {}

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        if (spec.viewSpec.selectParams) {
            if (spec.viewSpec.selectParams.filterPlaceholder) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.filterPlaceholder',
                    spec.viewSpec.selectParams.filterPlaceholder,
                );
            }

            if (spec.viewSpec.selectParams.meta) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.optionsMeta',
                    spec.viewSpec.selectParams.meta,
                );
            }
        }

        // radioGroupParams for old select not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // generateRandomValueButton for old select not expected
        // if (spec.viewSpec.generateRandomValueButton) {}
    },
    base: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maxLength) {
            const maxLength = Number(spec.maxLength);

            if (!isNaN(maxLength)) {
                set(mutableSchema, 'maxLength', maxLength);
            }
        }

        if (spec.minLength) {
            const minLength = Number(spec.minLength);

            if (!isNaN(minLength)) {
                set(mutableSchema, 'minLength', minLength);
            }
        }

        if (spec.pattern) {
            set(mutableSchema, 'pattern', spec.pattern);
        }

        if (spec.patternError) {
            set(mutableSchema, 'nodeParameters.errorMessages.pattern', spec.patternError);
        }

        // enum for old base not expected
        // if (spec.enum) {}

        // description for old base not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'base');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string base view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old base not expected
        // if (spec.viewSpec.sizeParams) {}

        // monacoParams for old base not expected
        // if (spec.viewSpec.monacoParams) {}

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string base view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(mutableSchema, 'nodeParameters.entityProps.placeholder', spec.viewSpec.placeholder);
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string base view spec key: "hidden"`);
        }

        // textContentParams for old base not expected
        // if (spec.viewSpec.textContentParams) {}

        // fileInput for old base not expected
        // if (spec.viewSpec.fileInput) {}

        // dateInput for old base not expected
        // if (spec.viewSpec.dateInput) {}

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        // selectParams for old base not expected
        // if (spec.viewSpec.selectParams) {}

        // radioGroupParams for old base not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        if (spec.viewSpec.generateRandomValueButton && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string base view spec key: "generateRandomValueButton"`,
            );
        }
    },
    file_input: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maxLength) {
            const maxLength = Number(spec.maxLength);

            if (!isNaN(maxLength)) {
                set(mutableSchema, 'maxLength', maxLength);
            }
        }

        if (spec.minLength) {
            const minLength = Number(spec.minLength);

            if (!isNaN(minLength)) {
                set(mutableSchema, 'minLength', minLength);
            }
        }

        // pattern for old file_input not expected
        // if (spec.pattern) {}

        // patternError for old file_input not expected
        // if (spec.patternError) {}

        // enum for old file_input not expected
        // if (spec.enum) {}

        // description for old file_input not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'file');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string file_input view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old file_input not expected
        // if (spec.viewSpec.sizeParams) {}

        // monacoParams for old file_input not expected
        // if (spec.viewSpec.monacoParams) {}

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string file_input view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        // placeholder for old file_input not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string file_input view spec key: "hidden"`);
        }

        // textContentParams for old file_input not expected
        // if (spec.viewSpec.textContentParams) {}

        if (spec.viewSpec.fileInput) {
            if (spec.viewSpec.fileInput.accept) {
                set(mutableSchema, 'nodeParameters.entityProps.accept', [
                    spec.viewSpec.fileInput.accept,
                ]);
            }

            if (spec.viewSpec.fileInput.readAsMethod) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.readAsMethod',
                    spec.viewSpec.fileInput.readAsMethod,
                );
            }

            if (spec.viewSpec.fileInput.ignoreText && process.env.NODE_ENV !== 'production') {
                console.warn(
                    `[dynamic-forms] Unknown string file_input view spec key: "fileInput.ignoreText"`,
                );
            }
        }

        // dateInput for old file_input not expected
        // if (spec.viewSpec.dateInput) {}

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        // selectParams for old file_input not expected
        // if (spec.viewSpec.selectParams) {}

        // radioGroupParams for old file_input not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // generateRandomValueButton for old file_input not expected
        // if (spec.viewSpec.generateRandomValueButton) {}
    },
    date_input: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        // json schema type is not set: the value may be a string, a date or a timestamp object

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        // maxLength for old date_input not expected
        // if (spec.maxLength) {}

        // minLength for old date_input not expected
        // if (spec.minLength) {}

        // pattern for old date_input not expected
        // if (spec.pattern) {}

        // patternError for old date_input not expected
        // if (spec.patternError) {}

        // enum for old date_input not expected
        // if (spec.enum) {}

        // description for old date_input not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.Any);
        set(mutableSchema, 'nodeParameters.entity', 'date');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string date_input view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old date_input not expected
        // if (spec.viewSpec.sizeParams) {}

        // monacoParams for old date_input not expected
        // if (spec.viewSpec.monacoParams) {}

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string date_input view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(mutableSchema, 'nodeParameters.entityProps.placeholder', spec.viewSpec.placeholder);
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string date_input view spec key: "hidden"`);
        }

        // textContentParams for old date_input not expected
        // if (spec.viewSpec.textContentParams) {}

        // fileInput for old date_input not expected
        // if (spec.viewSpec.fileInput) {}

        if (spec.viewSpec.dateInput) {
            if (spec.viewSpec.dateInput.outputFormat) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.outputFormat',
                    spec.viewSpec.dateInput.outputFormat,
                );
            }

            if (spec.viewSpec.dateInput.printFormat) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.format',
                    spec.viewSpec.dateInput.printFormat,
                );
            }

            if (spec.viewSpec.dateInput.timeZone) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.timeZone',
                    spec.viewSpec.dateInput.timeZone,
                );
            }
        }

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        // selectParams for old date_input not expected
        // if (spec.viewSpec.selectParams) {}

        // radioGroupParams for old date_input not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // generateRandomValueButton for old date_input not expected
        // if (spec.viewSpec.generateRandomValueButton) {}
    },
    color_picker: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        // maxLength for old color_picker not expected
        // if (spec.maxLength) {}

        // minLength for old color_picker not expected
        // if (spec.minLength) {}

        if (spec.pattern) {
            set(mutableSchema, 'pattern', spec.pattern);
        }

        if (spec.patternError) {
            set(mutableSchema, 'nodeParameters.errorMessages.pattern', spec.patternError);
        }

        // enum for old color_picker not expected
        // if (spec.enum) {}

        // description for old color_picker not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'color_picker');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string color_picker view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old color_picker not expected
        // if (spec.viewSpec.sizeParams) {}

        // monacoParams for old color_picker not expected
        // if (spec.viewSpec.monacoParams) {}

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string color_picker view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string color_picker view spec key: "placeholder", value - ${spec.viewSpec.placeholder}`,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string color_picker view spec key: "hidden"`);
        }

        // textContentParams for old color_picker not expected
        // if (spec.viewSpec.textContentParams) {}

        // fileInput for old color_picker not expected
        // if (spec.viewSpec.fileInput) {}

        // dateInput for old color_picker not expected
        // if (spec.viewSpec.dateInput) {}

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        // selectParams for old color_picker not expected
        // if (spec.viewSpec.selectParams) {}

        // radioGroupParams for old color_picker not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // generateRandomValueButton for old color_picker not expected
        // if (spec.viewSpec.generateRandomValueButton) {}
    },
    number_with_scale: (spec, mutableSchema, ctx) => {
        const numberWithScaleSpec = spec as NumberWithScaleSpec;

        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        // maxLength for old number_with_scale not expected
        // if (spec.maxLength) {}

        // minLength for old number_with_scale not expected
        // if (spec.minLength) {}

        // pattern for old number_with_scale not expected
        // if (spec.pattern) {}

        // patternError for old number_with_scale not expected
        // if (spec.patternError) {}

        // enum for old number_with_scale not expected
        // if (spec.enum) {}

        // description for old number_with_scale not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        // NumberWithScaleSpec keeps its numeric limits in the stringNumber keyword
        if (numberWithScaleSpec.minimum !== undefined) {
            const minimum = Number(numberWithScaleSpec.minimum);

            if (!isNaN(minimum)) {
                set(mutableSchema, 'stringNumber.minimum', `${minimum}`);
            }
        }

        if (numberWithScaleSpec.maximum !== undefined) {
            const maximum = Number(numberWithScaleSpec.maximum);

            if (!isNaN(maximum)) {
                set(mutableSchema, 'stringNumber.maximum', `${maximum}`);
            }
        }

        if (numberWithScaleSpec.format) {
            set(
                mutableSchema,
                'stringNumber.type',
                numberWithScaleSpec.format === 'int64'
                    ? JsonSchemaType.Integer
                    : JsonSchemaType.Number,
            );
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'string_number_with_scale');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string number_with_scale view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        if (spec.viewSpec.sizeParams) {
            if (spec.viewSpec.sizeParams.defaultType) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.defaultType',
                    spec.viewSpec.sizeParams.defaultType,
                );
            }

            if (spec.viewSpec.sizeParams.scale) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.scale',
                    spec.viewSpec.sizeParams.scale,
                );
            }

            if (spec.viewSpec.sizeParams.viewType) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.viewType',
                    spec.viewSpec.sizeParams.viewType,
                );
            }
        }

        // monacoParams for old number_with_scale not expected
        // if (spec.viewSpec.monacoParams) {}

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string number_with_scale view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder) {
            set(mutableSchema, 'nodeParameters.entityProps.placeholder', spec.viewSpec.placeholder);
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string number_with_scale view spec key: "hidden"`,
            );
        }

        // textContentParams for old number_with_scale not expected
        // if (spec.viewSpec.textContentParams) {}

        // fileInput for old number_with_scale not expected
        // if (spec.viewSpec.fileInput) {}

        // dateInput for old number_with_scale not expected
        // if (spec.viewSpec.dateInput) {}

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        // selectParams for old number_with_scale not expected
        // if (spec.viewSpec.selectParams) {}

        // radioGroupParams for old number_with_scale not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // generateRandomValueButton for old number_with_scale not expected
        // if (spec.viewSpec.generateRandomValueButton) {}
    },
    monaco_input: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        if (spec.maxLength) {
            const maxLength = Number(spec.maxLength);

            if (!isNaN(maxLength)) {
                set(mutableSchema, 'maxLength', maxLength);
            }
        }

        if (spec.minLength) {
            const minLength = Number(spec.minLength);

            if (!isNaN(minLength)) {
                set(mutableSchema, 'minLength', minLength);
            }
        }

        // pattern for old monaco_input not expected
        // if (spec.pattern) {}

        // patternError for old monaco_input not expected
        // if (spec.patternError) {}

        // enum for old monaco_input not expected
        // if (spec.enum) {}

        // description for old monaco_input not expected
        // if (spec.description) {}

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'monaco');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string monaco_input view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old monaco_input not expected
        // if (spec.viewSpec.sizeParams) {}

        if (spec.viewSpec.monacoParams) {
            if (spec.viewSpec.monacoParams.language) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.language',
                    spec.viewSpec.monacoParams.language,
                );
            }

            if (spec.viewSpec.monacoParams.fontSize) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.options.fontSize',
                    spec.viewSpec.monacoParams.fontSize,
                );
            }

            if (process.env.NODE_ENV !== 'production') {
                (
                    [
                        'headerIconSize',
                        'headerIconIndent',
                        'headerTitleVariant',
                        'headerDialogButtonSize',
                        'headerDialogIconSize',
                    ] as const
                ).forEach((key) => {
                    if (spec.viewSpec.monacoParams?.[key] !== undefined) {
                        console.warn(
                            `[dynamic-forms] Unknown string monaco_input view spec key: "monacoParams.${key}", value - ${spec.viewSpec.monacoParams[key]}`,
                        );
                    }
                });
            }
        }

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string monaco_input view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string monaco_input view spec key: "placeholder", value - ${spec.viewSpec.placeholder}`,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string monaco_input view spec key: "hidden"`);
        }

        // textContentParams for old monaco_input not expected
        // if (spec.viewSpec.textContentParams) {}

        // fileInput for old monaco_input not expected
        // if (spec.viewSpec.fileInput) {}

        // dateInput for old monaco_input not expected
        // if (spec.viewSpec.dateInput) {}

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        // selectParams for old monaco_input not expected
        // if (spec.viewSpec.selectParams) {}

        // radioGroupParams for old monaco_input not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // generateRandomValueButton for old monaco_input not expected
        // if (spec.viewSpec.generateRandomValueButton) {}
    },
    text_content: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        // required for old text_content not expected
        // if (spec.required) {}

        // maxLength for old text_content not expected
        // if (spec.maxLength) {}

        // minLength for old text_content not expected
        // if (spec.minLength) {}

        // pattern for old text_content not expected
        // if (spec.pattern) {}

        // patternError for old text_content not expected
        // if (spec.patternError) {}

        // enum for old text_content not expected
        // if (spec.enum) {}

        // description for old text_content not expected
        // if (spec.description) {}

        // validator for old text_content not expected
        // if (spec.validator) {}

        // disabled for old text_content not expected
        // if (spec.viewSpec.disabled) {}

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'text_content');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string text_content view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old text_content not expected
        // if (spec.viewSpec.sizeParams) {}

        // monacoParams for old text_content not expected
        // if (spec.viewSpec.monacoParams) {}

        // hideValues for old text_content not expected
        // if (spec.viewSpec.hideValues) {}

        // placeholder for old text_content not expected
        // if (spec.viewSpec.placeholder) {}

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string text_content view spec key: "hidden"`);
        }

        if (spec.viewSpec.textContentParams) {
            // the new kit splits the old text_content into text_content, alert and label entities
            if (spec.viewSpec.textContentParams.themeAlert) {
                set(mutableSchema, 'nodeParameters.entity', 'alert');
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.theme',
                    spec.viewSpec.textContentParams.themeAlert,
                );

                if (spec.viewSpec.textContentParams.text) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.message',
                        spec.viewSpec.textContentParams.text,
                    );
                }

                if (spec.viewSpec.textContentParams.titleAlert) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.title',
                        spec.viewSpec.textContentParams.titleAlert,
                    );
                }

                if (spec.viewSpec.textContentParams.viewAlert) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.view',
                        spec.viewSpec.textContentParams.viewAlert,
                    );
                }
            } else if (spec.viewSpec.textContentParams.themeLabel) {
                set(mutableSchema, 'nodeParameters.entity', 'label');
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.theme',
                    spec.viewSpec.textContentParams.themeLabel,
                );

                if (spec.viewSpec.textContentParams.text) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.title',
                        spec.viewSpec.textContentParams.text,
                    );
                }
            } else if (spec.viewSpec.textContentParams.text) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.title',
                    spec.viewSpec.textContentParams.text,
                );
            }

            if (spec.viewSpec.textContentParams.icon) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.iconName',
                    spec.viewSpec.textContentParams.icon,
                );
            }

            if (spec.viewSpec.textContentParams.iconColor) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.iconProps.color',
                    spec.viewSpec.textContentParams.iconColor,
                );
            }
        }

        // fileInput for old text_content not expected
        // if (spec.viewSpec.fileInput) {}

        // dateInput for old text_content not expected
        // if (spec.viewSpec.dateInput) {}

        // copy for old text_content not expected
        // if (spec.viewSpec.copy) {}

        // selectParams for old text_content not expected
        // if (spec.viewSpec.selectParams) {}

        // radioGroupParams for old text_content not expected
        // if (spec.viewSpec.radioGroupParams) {}

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // generateRandomValueButton for old text_content not expected
        // if (spec.viewSpec.generateRandomValueButton) {}
    },
    radio_group: (spec, mutableSchema, ctx) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }

        set(mutableSchema, 'type', JsonSchemaType.String);

        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {not: {enum: [null, undefined, '', false]}},
            ]);
            set(mutableSchema, 'nodeParameters.layoutProps.required', true);
        }

        // maxLength for old radio_group not expected
        // if (spec.maxLength) {}

        // minLength for old radio_group not expected
        // if (spec.minLength) {}

        // pattern for old radio_group not expected
        // if (spec.pattern) {}

        // patternError for old radio_group not expected
        // if (spec.patternError) {}

        if (spec.enum) {
            set(mutableSchema, 'enum', spec.enum);
        }

        if (spec.description) {
            set(mutableSchema, 'nodeParameters.entityProps.enumDescriptions', spec.description);
        }

        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.entityProps.validator', spec.validator);
        }

        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.entityProps.disabled', true);
        }

        set(mutableSchema, 'nodeParameters.type', NodeType.String);
        set(mutableSchema, 'nodeParameters.entity', 'radio_group');

        if (spec.viewSpec.layout) {
            const layoutRule = ctx?.layoutRules?.[spec.viewSpec.layout];

            if (layoutRule) {
                layoutRule(spec, mutableSchema, ctx);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown view spec layout: ${spec.viewSpec.layout}`);
            }
        }

        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }

        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }

        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.layoutProps.open', spec.viewSpec.layoutOpen);
        }

        if (spec.viewSpec.link && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string radio_group view spec key: "link", value - ${JSON.stringify(
                    spec.viewSpec.link,
                    null,
                    2,
                )}`,
            );
        }

        // sizeParams for old radio_group not expected
        // if (spec.viewSpec.sizeParams) {}

        // monacoParams for old radio_group not expected
        // if (spec.viewSpec.monacoParams) {}

        if (spec.viewSpec.hideValues && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string radio_group view spec key: "hideValues", value - ${JSON.stringify(
                    spec.viewSpec.hideValues,
                )}`,
            );
        }

        if (spec.viewSpec.placeholder && process.env.NODE_ENV !== 'production') {
            console.warn(
                `[dynamic-forms] Unknown string radio_group view spec key: "placeholder", value - ${spec.viewSpec.placeholder}`,
            );
        }

        if (spec.viewSpec.hidden && process.env.NODE_ENV !== 'production') {
            console.warn(`[dynamic-forms] Unknown string radio_group view spec key: "hidden"`);
        }

        // textContentParams for old radio_group not expected
        // if (spec.viewSpec.textContentParams) {}

        // fileInput for old radio_group not expected
        // if (spec.viewSpec.fileInput) {}

        // dateInput for old radio_group not expected
        // if (spec.viewSpec.dateInput) {}

        if (spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.layoutProps.copy', true);
        }

        // selectParams for old radio_group not expected
        // if (spec.viewSpec.selectParams) {}

        if (spec.viewSpec.radioGroupParams) {
            if (spec.viewSpec.radioGroupParams.direction) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.direction',
                    spec.viewSpec.radioGroupParams.direction,
                );
            }

            if (spec.viewSpec.radioGroupParams.disabled) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.optionsDisabled',
                    spec.viewSpec.radioGroupParams.disabled,
                );
            }
        }

        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }

        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }

        // generateRandomValueButton for old radio_group not expected
        // if (spec.viewSpec.generateRandomValueButton) {}
    },
};

interface SpecToJsonSchemaContenxt {
    arrayInputTypeRules?: typeof arrayInputTypeRules;
    booleanInputTypeRules?: typeof booleanInputTypeRules;
    numberInputTypeRules?: typeof numberInputTypeRules;
    objectInputTypeRules?: typeof objectInputTypeRules;
    stringInputTypeRules?: typeof stringInputTypeRules;
    layoutRules?: typeof layoutRules;
}

export function specToJsonSchema(
    spec: Spec,
    jsonSchema?: JsonSchemaAny,
    ctx?: SpecToJsonSchemaContenxt,
): JsonSchema {
    const context = {
        arrayInputTypeRules: {...arrayInputTypeRules, ...ctx?.arrayInputTypeRules},
        booleanInputTypeRules: {...booleanInputTypeRules, ...ctx?.booleanInputTypeRules},
        numberInputTypeRules: {...numberInputTypeRules, ...ctx?.numberInputTypeRules},
        objectInputTypeRules: {...objectInputTypeRules, ...ctx?.objectInputTypeRules},
        stringInputTypeRules: {...stringInputTypeRules, ...ctx?.stringInputTypeRules},
        layoutRules: {...layoutRules, ...ctx?.layoutRules},
    };
    const schema: JsonSchema = jsonSchema || {};

    if (isArraySpec(spec)) {
        if (spec.viewSpec.type) {
            const rule = context.arrayInputTypeRules[spec.viewSpec.type];

            if (rule) {
                rule(spec, schema, context);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`[dynamic-forms] Unknown array view spec type: ${spec.viewSpec.type}`);
            }
        }
    }

    if (isBooleanSpec(spec)) {
        if (spec.viewSpec.type) {
            const rule = context.booleanInputTypeRules[spec.viewSpec.type];

            if (rule) {
                rule(spec, schema, context);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    `[dynamic-forms] Unknown boolean view spec type: ${spec.viewSpec.type}`,
                );
            }
        }
    }

    if (isNumberSpec(spec)) {
        if (spec.viewSpec.type) {
            const rule = context.numberInputTypeRules[spec.viewSpec.type];

            if (rule) {
                rule(spec, schema, context);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    `[dynamic-forms] Unknown number view spec type: ${spec.viewSpec.type}`,
                );
            }
        }
    }

    if (isObjectSpec(spec)) {
        if (spec.viewSpec.type) {
            const rule = context.objectInputTypeRules[spec.viewSpec.type];

            if (rule) {
                rule(spec, schema, context);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    `[dynamic-forms] Unknown object view spec type: ${spec.viewSpec.type}`,
                );
            }
        }
    }

    if (isStringSpec(spec)) {
        if (spec.viewSpec.type) {
            const rule = context.stringInputTypeRules[spec.viewSpec.type];

            if (rule) {
                rule(spec, schema, context);
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    `[dynamic-forms] Unknown string view spec type: ${spec.viewSpec.type}`,
                );
            }
        }
    }

    return schema;
}
