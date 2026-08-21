/* eslint-disable complexity */

import Decimal from 'decimal.js';
import {type Keyword, addKeywords, compileSchema, draft07, getTypeOf} from 'json-schema-library';
import get from 'lodash/get';
import isString from 'lodash/isString';

import {JsonSchemaType} from '../../constants';
import type {JsonSchema, JsonSchemaString, NodesConfig, Validator} from '../../types';

export interface GetSchemaRootNodeParams {
    config?: NodesConfig;
    keywords?: Keyword[];
    schema: JsonSchema;
}

export const getSchemaRootNode = ({
    config,
    keywords,
    schema: rootSchema,
}: GetSchemaRootNodeParams) => {
    const nodeParametersKeyword: Keyword = {
        id: 'nodeParameters',
        keyword: 'nodeParameters',
        addValidate: (node) => node.schema.nodeParameters?.validator !== undefined,
        validate: ({node, data: value, pointer}) => {
            const schema: JsonSchema = node.schema;

            if (schema.nodeParameters) {
                let validator: Validator<JsonSchema> | undefined;

                if (isString(schema.nodeParameters.validator)) {
                    const nodeType = schema.nodeParameters.type;
                    const validatorType = schema.nodeParameters.validator;

                    validator = get(config, `${nodeType}.validators.${validatorType}`);
                } else {
                    validator = schema.nodeParameters.validator;
                }

                if (validator) {
                    return node.createError(
                        'node-parameters-error',
                        {pointer, schema, value, validator},
                        '',
                    );
                }
            }

            return undefined;
        },
    };

    const stringNumberKeyword: Keyword = {
        id: 'stringNumber',
        keyword: 'stringNumber',
        addValidate: (node) => node.schema.stringNumber !== undefined,
        validate: ({node, data: value, pointer}) => {
            const schema: JsonSchemaString = node.schema;
            const stringNumber = schema.stringNumber;

            if (!stringNumber) {
                return undefined;
            }

            const isStringInt = (v: unknown) => /^-?(0|[1-9][0-9]*)$/.test(`${v}`);
            const isStringFloat = (v: unknown) => /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(`${v}`);
            const isStringNumber = (v: unknown) => isStringInt(v) || isStringFloat(v);

            if (stringNumber.type) {
                const types = Array.isArray(stringNumber.type)
                    ? stringNumber.type
                    : [stringNumber.type];
                const satisfactoryByType = {
                    [JsonSchemaType.Integer]: isStringInt(value),
                    [JsonSchemaType.Number]: isStringFloat(value),
                    [JsonSchemaType.Null]: value === null,
                };

                if (!types.some((type) => satisfactoryByType[type])) {
                    return node.createError('type-error', {
                        pointer,
                        schema,
                        value,
                        received: getTypeOf(value),
                        expected: types.join(', '),
                    });
                }
            }

            if (
                stringNumber.exclusiveMaximum &&
                isStringNumber(stringNumber.exclusiveMaximum) &&
                isStringNumber(value) &&
                !new Decimal(`${value}`).lessThan(stringNumber.exclusiveMaximum)
            ) {
                return node.createError('exclusive-maximum-error', {
                    pointer,
                    schema,
                    value,
                    maximum: stringNumber.exclusiveMaximum,
                    length: value,
                });
            }

            if (
                stringNumber.exclusiveMinimum &&
                isStringNumber(stringNumber.exclusiveMinimum) &&
                isStringNumber(value) &&
                !new Decimal(`${value}`).greaterThan(stringNumber.exclusiveMinimum)
            ) {
                return node.createError('exclusive-minimum-error', {
                    pointer,
                    schema,
                    value,
                    minimum: stringNumber.exclusiveMinimum,
                    length: value,
                });
            }

            if (
                stringNumber.maximum &&
                isStringNumber(stringNumber.maximum) &&
                isStringNumber(value) &&
                !new Decimal(`${value}`).lessThanOrEqualTo(stringNumber.maximum)
            ) {
                return node.createError('maximum-error', {
                    pointer,
                    schema,
                    value,
                    maximum: stringNumber.maximum,
                    length: value,
                });
            }

            if (
                stringNumber.minimum &&
                isStringNumber(stringNumber.minimum) &&
                isStringNumber(value) &&
                !new Decimal(`${value}`).greaterThanOrEqualTo(stringNumber.minimum)
            ) {
                return node.createError('minimum-error', {
                    pointer,
                    schema,
                    value,
                    minimum: stringNumber.minimum,
                    length: value,
                });
            }

            if (
                stringNumber.multipleOf &&
                isStringNumber(stringNumber.multipleOf) &&
                stringNumber.multipleOf !== '0' &&
                isStringNumber(value) &&
                !new Decimal(`${value}`).mod(stringNumber.multipleOf).isZero()
            ) {
                return node.createError('multiple-of-error', {
                    pointer,
                    schema,
                    value,
                    multipleOf: stringNumber.multipleOf,
                });
            }

            return undefined;
        },
    };

    const draft = addKeywords(
        draft07,
        ...(keywords || []),
        nodeParametersKeyword,
        stringNumberKeyword,
    );

    return compileSchema(rootSchema, {
        drafts: [draft],
        formatAssertion: false,
    });
};
