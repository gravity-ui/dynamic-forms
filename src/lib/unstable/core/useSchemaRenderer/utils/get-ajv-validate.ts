import Ajv from 'ajv';
import type {
    ErrorObject,
    FuncKeywordDefinition,
    SchemaValidateFunction,
    ValidateFunction,
} from 'ajv';
import get from 'lodash/get';

import type {EntityType} from '../../constants';
import type {FieldValue, JsonSchema, SchemaRendererConfig, Validator} from '../../types';
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
