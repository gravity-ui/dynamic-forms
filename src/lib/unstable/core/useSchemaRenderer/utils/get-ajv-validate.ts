import Ajv from 'ajv';
import type {
    ErrorObject,
    FuncKeywordDefinition,
    SchemaValidateFunction,
    ValidateFunction,
} from 'ajv';
import get from 'lodash/get';

import type {JsonSchemaType} from '../../constants';
import type {FieldValue, JsonSchema, SchemaRendererConfig, Validator} from '../../types';
import {getSchemaType} from '../../utils';
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
            const schemaType: JsonSchemaType = getSchemaType(schema);
            const validatorType: string | undefined = schema.entityParameters.validatorType;
            const validator: Validator<JsonSchema> | undefined = get(
                config,
                `${schemaType}.validators.${validatorType}`,
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

    const ajv = new Ajv({
        allErrors: true,
        allowMatchingProperties: true,
        keywords: [
            {
                errors: true,
                keyword: 'entityParameters',
                validate: entityParametersValidate as FuncKeywordDefinition['validate'],
            },
        ],
    });
    const ajvValidate = ajv.compile(schema) as GetAjvValidateReturn;

    return ajvValidate;
};
