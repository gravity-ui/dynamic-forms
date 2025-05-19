import Ajv from 'ajv';
import type {
    ErrorObject,
    FuncKeywordDefinition,
    SchemaValidateFunction,
    ValidateFunction,
} from 'ajv';
import get from 'lodash/get';

import type {FieldValue, JsonSchema, SchemaRendererConfig, Validator} from '../../types';
import type {EntityParametersError} from '../types';

interface GetAjvValidateParams {
    config: SchemaRendererConfig;
    mainSchema: JsonSchema;
}

interface GetAjvValidateReturn extends ValidateFunction {
    errors?: (ErrorObject | EntityParametersError)[];
}

export const getAjvValidate = ({
    config,
    mainSchema,
}: GetAjvValidateParams): GetAjvValidateReturn => {
    function entityParametersValidate(_: unknown, value: FieldValue, schema?: JsonSchema) {
        if (schema) {
            const validatorType: string | undefined = get(schema, 'entityParameters.validatorType');
            const validator: Validator<JsonSchema> | undefined = get(
                config,
                `${schema.type}.validators.${validatorType}`,
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
    const ajvValidate = ajv.compile(mainSchema) as GetAjvValidateReturn;

    return ajvValidate;
};
