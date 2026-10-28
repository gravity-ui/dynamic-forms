import get from 'lodash/get';

import i18n from '../../../kit/i18n';
import {subscribeConfigure} from '../../../kit/i18n/configure';
import type {ErrorMessages, JSLErrors, JsonSchemaArray, JsonSchemaObject} from '../../core';

const TYPE_I18N_KEYS: Record<string, string> = {
    array: 'label-sr_type-array',
    boolean: 'label-sr_type-boolean',
    integer: 'label-sr_type-integer',
    null: 'label-sr_type-null',
    number: 'label-sr_type-number',
    object: 'label-sr_type-object',
    string: 'label-sr_type-string',
};

const getErrorMessages = (): Required<ErrorMessages> => ({
    additionalItems: (e) => {
        const schema: JsonSchemaArray = e.data.schema;

        if (Array.isArray(schema.items)) {
            return i18n('label-sr_error-additional-items', {count: schema.items.length});
        }

        return e.message;
    },
    additionalProperties: (e) => {
        const schema: JsonSchemaObject = e.data.schema;

        if (schema.properties) {
            return i18n('label-sr_error-additional-properties', {
                count: Object.keys(schema.properties).length,
            });
        }

        return e.message;
    },
    anyOf: i18n('label-sr_error-any-of'),
    const: (e) => i18n('label-sr_error-const', {expected: JSON.stringify(e.data.expected)}),
    contains: (e: JSLErrors.ContainsAny | JSLErrors.ContainsMin) =>
        e.code === 'contains-min-error'
            ? i18n('label-sr_error-contains-min')
            : i18n('label-sr_error-contains'),
    dependencies: (e) => {
        let property: string = e.data.missingProperty;
        const title = get(e, `data.schema.properties.${property}.title`);

        if (typeof title === 'string') {
            property = title;
        }

        return i18n('label-sr_error-dependencies', {property});
    },
    enum: (e) => i18n('label-sr_error-enum', {value: JSON.stringify(e.data.value)}),
    exclusiveMaximum: (e) => i18n('label-sr_error-exclusive-maximum', {count: e.data.maximum}),
    exclusiveMinimum: (e) => i18n('label-sr_error-exclusive-minimum', {count: e.data.minimum}),
    maxItems: (e) => i18n('label-sr_error-max-items', {count: e.data.maximum}),
    maxLength: (e) => i18n('label-sr_error-max-length', {count: e.data.maxLength}),
    maxProperties: (e) => i18n('label-sr_error-max-properties', {count: e.data.maxProperties}),
    maximum: (e) => i18n('label-sr_error-maximum', {count: e.data.maximum}),
    minItems: (e) => i18n('label-sr_error-min-items', {count: e.data.minItems}),
    minLength: (e) => i18n('label-sr_error-min-length', {count: e.data.minLength}),
    minProperties: (e) => i18n('label-sr_error-min-properties', {count: e.data.minProperties}),
    minimum: (e) => i18n('label-sr_error-minimum', {count: e.data.minimum}),
    multipleOf: (e) => i18n('label-sr_error-multiple-of', {count: e.data.multipleOf}),
    not: i18n('label-sr_error-not'),
    oneOf: i18n('label-sr_error-one-of'),
    pattern: (e) => i18n('label-sr_error-pattern', {pattern: e.data.pattern}),
    propertyNames: (e) => i18n('label-sr_error-property-names', {property: e.data.property}),
    required: i18n('label-sr_error-required'),
    type: (e) => {
        const types = e.data.expected.split(',');
        let expected = '';

        types.forEach((t, i, arr) => {
            let type = t.trim();

            if (TYPE_I18N_KEYS[type]) {
                type = i18n(TYPE_I18N_KEYS[type]);
            }

            if (i === 0) {
                expected += type;
            } else if (i === arr.length - 1) {
                expected += i18n('label-sr_error-type-or', {type});
            } else {
                expected += `, ${type}`;
            }
        });

        return i18n('label-sr_error-type', {expected});
    },
    uniqueItems: i18n('label-sr_error-unique-items'),
});

export let errorMessages: Required<ErrorMessages> = getErrorMessages();

subscribeConfigure(() => {
    errorMessages = getErrorMessages();
});
