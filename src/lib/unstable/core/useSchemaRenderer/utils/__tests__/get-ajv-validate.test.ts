import {EntityType} from '../../../constants';
import type {JsonSchema} from '../../../types';

import {
    CUSTOM_VALIDATOR_WITH_ERROR_TYPE,
    createAjvValidate,
    customValidatorWithError,
} from './fixtures.test';

describe('getAjvValidate', () => {
    test('returns an entity parameters error when validator exists', () => {
        const schema: JsonSchema = {
            entityParameters: {
                type: EntityType.String,
                validatorType: CUSTOM_VALIDATOR_WITH_ERROR_TYPE,
            },
        };
        const ajvValidate = createAjvValidate({schema});
        const value = 'jajaja';

        ajvValidate(value);

        expect(ajvValidate.errors).toEqual([
            {
                keyword: 'entityParameters',
                instancePath: '',
                schemaPath: '#/entityParameters',
                params: {
                    validator: customValidatorWithError,
                    value,
                    schema: {
                        entityParameters: {
                            type: EntityType.String,
                            validatorType: CUSTOM_VALIDATOR_WITH_ERROR_TYPE,
                        },
                    },
                },
                message: '',
            },
        ]);
    });

    test('returns no errors when validator does not exist', () => {
        const schema: JsonSchema = {
            entityParameters: {type: EntityType.String, validatorType: 'unknown-validator'},
        };
        const ajvValidate = createAjvValidate({schema});
        const value = 'jajaja';

        ajvValidate(value);

        expect(ajvValidate.errors).toBe(null);
    });

    test('returns no errors when type does not exist', () => {
        const schema: JsonSchema = {
            entityParameters: {
                type: undefined as unknown as EntityType.Any,
                validatorType: 'unknown-validator',
            },
        };
        const ajvValidate = createAjvValidate({schema});
        const value = 'jajaja';

        ajvValidate(value);

        expect(ajvValidate.errors).toBe(null);
    });
});
