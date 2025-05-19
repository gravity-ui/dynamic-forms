import {JsonSchemaType} from '../../../constants';
import type {
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
    SchemaRendererConfig,
    Validator,
} from '../../../types';
import {getAjvValidate} from '../get-ajv-validate';

describe('SchemaRendererServiceField/utils/get-ajv-validate', () => {
    const emailValidator: Validator<JsonSchemaString> = (value) => {
        if (typeof value !== 'string' || !value.includes('@')) {
            return 'Invalid email format';
        }

        return false;
    };
    const emailSchema: JsonSchemaString = {
        type: JsonSchemaType.String,
        entityParameters: {
            validatorType: 'emailValidator',
        },
    };
    const emailValue = 'email';
    const emailError = {
        instancePath: '/email',
        keyword: 'entityParameters',
        message: '',
        params: {validator: emailValidator, value: emailValue, schema: emailSchema},
        schemaPath: '#/properties/email/entityParameters',
    };

    const ageValidator: Validator<JsonSchemaNumber> = (value) => {
        if (typeof value !== 'number' || value < 18 || value > 100) {
            return 'Age must be between 18 and 100';
        }

        return false;
    };
    const ageSchema: JsonSchemaNumber = {
        type: JsonSchemaType.Number,
        entityParameters: {
            validatorType: 'ageValidator',
        },
    };
    const ageValue = 10;
    const ageError = {
        instancePath: '/age',
        keyword: 'entityParameters',
        message: '',
        params: {validator: ageValidator, value: ageValue, schema: ageSchema},
        schemaPath: '#/properties/age/entityParameters',
    };

    it('should validate with entityParameters validator', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {email: emailSchema},
        };

        const config: SchemaRendererConfig = {
            [JsonSchemaType.Array]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.Boolean]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.Number]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.Object]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.String]: {
                views: {},
                wrappers: {},
                validators: {emailValidator},
            },
        };

        const ajvValidate = getAjvValidate({config, mainSchema});

        ajvValidate({email: emailValue});

        expect(ajvValidate.errors).toEqual([emailError]);
    });

    it('should handle multiple validators for different fields', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {email: emailSchema, age: ageSchema},
        };

        const config: SchemaRendererConfig = {
            [JsonSchemaType.Array]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.Boolean]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.Number]: {
                views: {},
                wrappers: {},
                validators: {ageValidator},
            },
            [JsonSchemaType.Object]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.String]: {
                views: {},
                wrappers: {},
                validators: {emailValidator},
            },
        };

        const ajvValidate = getAjvValidate({config, mainSchema});

        ajvValidate({email: emailValue, age: ageValue});

        expect(ajvValidate.errors).toEqual([emailError, ageError]);
    });

    it('should handle empty validator type', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {email: emailSchema, age: ageSchema},
        };

        const config: SchemaRendererConfig = {
            [JsonSchemaType.Array]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.Boolean]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.Number]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.Object]: {
                views: {},
                wrappers: {},
                validators: {},
            },
            [JsonSchemaType.String]: {
                views: {},
                wrappers: {},
                validators: {emailValidator},
            },
        };

        const ajvValidate = getAjvValidate({config, mainSchema});

        ajvValidate({email: emailValue, age: ageValue});

        expect(ajvValidate.errors).toEqual([emailError]);
    });
});
