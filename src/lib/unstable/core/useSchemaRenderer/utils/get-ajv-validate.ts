/* eslint-disable complexity */

import Ajv from 'ajv';
import type {
    ErrorObject,
    FuncKeywordDefinition,
    SchemaValidateFunction,
    ValidateFunction,
} from 'ajv';
import Decimal from 'decimal.js';
import get from 'lodash/get';

import {type EntityType, JsonSchemaType} from '../../constants';
import type {
    FieldValue,
    JsonSchema,
    JsonSchemaString,
    SchemaRendererConfig,
    Validator,
} from '../../types';
import type {EntityParametersError} from '../types';

export interface GetAjvValidateParams {
    config: SchemaRendererConfig;
    schema: JsonSchema;
}

export interface GetAjvValidateReturn extends ValidateFunction {
    errors?: (ErrorObject | EntityParametersError)[];
}

export const getAjvValidate = ({config, schema}: GetAjvValidateParams): GetAjvValidateReturn => {
    function entityParametersValidate(_: unknown, value: FieldValue, schema?: JsonSchema) {
        if (schema && schema.entityParameters) {
            const entityType: EntityType | undefined = get(schema, 'entityParameters.type');
            const validatorType: string | undefined = schema.entityParameters.validatorType;
            const validator: Validator<JsonSchema> | undefined = get(
                config,
                `${entityType}.validators.${validatorType}`,
            );

            if (validator) {
                const error: Partial<EntityParametersError> = {
                    keyword: 'entityParameters',
                    message: '',
                    params: {validator, value, schema},
                };

                (entityParametersValidate as SchemaValidateFunction).errors = [error];

                return false;
            }
        }

        return true;
    }

    function stringNumberValidate(_: unknown, value: FieldValue, schema?: JsonSchema) {
        const stringNumber = get(schema, 'stringNumber') as
            | JsonSchemaString['stringNumber']
            | undefined;

        if (!stringNumber) {
            return true;
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
                (stringNumberValidate as SchemaValidateFunction).errors = [
                    {
                        keyword: 'type',
                        message: 'must be ' + types.join(', '),
                        params: {type: stringNumber.type},
                    },
                ];

                return false;
            }
        }

        if (
            stringNumber.exclusiveMaximum &&
            isStringNumber(stringNumber.exclusiveMaximum) &&
            isStringNumber(value) &&
            !new Decimal(`${value}`).lessThan(stringNumber.exclusiveMaximum)
        ) {
            (stringNumberValidate as SchemaValidateFunction).errors = [
                {
                    keyword: 'exclusiveMaximum',
                    message: `must be < ${stringNumber.exclusiveMaximum}`,
                    params: {limit: stringNumber.exclusiveMaximum, comparisons: '<'},
                },
            ];

            return false;
        }

        if (
            stringNumber.exclusiveMinimum &&
            isStringNumber(stringNumber.exclusiveMinimum) &&
            isStringNumber(value) &&
            !new Decimal(`${value}`).greaterThan(stringNumber.exclusiveMinimum)
        ) {
            (stringNumberValidate as SchemaValidateFunction).errors = [
                {
                    keyword: 'exclusiveMinimum',
                    message: `must be > ${stringNumber.exclusiveMinimum}`,
                    params: {limit: stringNumber.exclusiveMinimum, comparisons: '>'},
                },
            ];

            return false;
        }

        if (
            stringNumber.maximum &&
            isStringNumber(stringNumber.maximum) &&
            isStringNumber(value) &&
            !new Decimal(`${value}`).lessThanOrEqualTo(stringNumber.maximum)
        ) {
            (stringNumberValidate as SchemaValidateFunction).errors = [
                {
                    keyword: 'maximum',
                    message: `must be <= ${stringNumber.maximum}`,
                    params: {limit: stringNumber.maximum, comparisons: '<='},
                },
            ];

            return false;
        }

        if (
            stringNumber.minimum &&
            isStringNumber(stringNumber.minimum) &&
            isStringNumber(value) &&
            !new Decimal(`${value}`).greaterThanOrEqualTo(stringNumber.minimum)
        ) {
            (stringNumberValidate as SchemaValidateFunction).errors = [
                {
                    keyword: 'minimum',
                    message: `must be >= ${stringNumber.minimum}`,
                    params: {limit: stringNumber.minimum, comparisons: '>='},
                },
            ];

            return false;
        }

        if (
            stringNumber.multipleOf &&
            isStringNumber(stringNumber.multipleOf) &&
            stringNumber.multipleOf !== '0' &&
            isStringNumber(value) &&
            !new Decimal(`${value}`).mod(stringNumber.multipleOf).isZero()
        ) {
            (stringNumberValidate as SchemaValidateFunction).errors = [
                {
                    keyword: 'multipleOf',
                    message: `must be multiple of ${stringNumber.multipleOf}`,
                    params: {multipleOf: stringNumber.multipleOf},
                },
            ];

            return false;
        }

        return true;
    }

    const ajv = new Ajv({
        allErrors: true,
        allowMatchingProperties: true,
        keywords: [
            {
                errors: true,
                keyword: 'entityParameters',
                validate: entityParametersValidate as FuncKeywordDefinition['validate'],
            },
            {
                errors: true,
                keyword: 'stringNumber',
                validate: stringNumberValidate as FuncKeywordDefinition['validate'],
            },
        ],
    });
    const ajvValidate = ajv.compile(schema) as GetAjvValidateReturn;

    return ajvValidate;
};
