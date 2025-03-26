import type {ErrorObject, ValidateFunction} from 'ajv';
import type {FieldValidator} from 'final-form';

import type {SchemaRendererMode} from '../../constants';
import type {
    ErrorMessages,
    FieldValue,
    IndependentView,
    JsonSchema,
    SchemaRendererConfig,
    SchemaToValueType,
    SetValidationCacheMutator,
    SetValidationWaitersMutator,
    SimpleView,
    Validator,
    Wrapper,
} from '../../types';

/**
 * getRenderKit types start
 */

export type GetRenderKitParams<Schema extends JsonSchema> = {
    config: SchemaRendererConfig;
    mode: SchemaRendererMode;
    schema: Schema;
};

export type GetRenderKitReturn<Schema extends JsonSchema> =
    | {
          View: SimpleView<Schema> | undefined;
          Wrapper: Wrapper<Schema> | undefined;
          independent: false | undefined;
          viewProps: Record<string, any>;
          wrapperProps: Record<string, any>;
      }
    | {
          View: IndependentView<Schema>;
          Wrapper: Wrapper<Schema> | undefined;
          independent: true;
          viewProps: Record<string, any>;
          wrapperProps: Record<string, any>;
      };

/**
 * getRenderKit types end
 */

/**
 * getAjvValidate types start
 */

export type EntityParametersError = ErrorObject<
    'entityParameters',
    {
        schema: JsonSchema;
        validator: Validator<JsonSchema>;
        value: FieldValue | null | undefined;
    }
>;

export type GetAjvValidateParams = {
    config: SchemaRendererConfig;
    schema: JsonSchema;
};

export interface GetAjvValidateReturn extends ValidateFunction {
    errors?: (ErrorObject | EntityParametersError)[];
}

/**
 * getAjvValidate types end
 */

/**
 * getError types start
 */

export type GetErrorParams = {
    errorMessages: Record<string, string>;
    instancePath: string;
    keyword: string;
    schema: JsonSchema;
    schemaPath: string;
};

/**
 * getError types end
 */
/**
 * getValidate types start
 */

export type GetValidateParams<Schema extends JsonSchema> = {
    config: SchemaRendererConfig;
    errorMessages: ErrorMessages;
    name: string;
    schema: Schema;
    setValidationCache: SetValidationCacheMutator;
    setValidationWaiters: SetValidationWaitersMutator;
};

export type GetValidateReturn<Schema extends JsonSchema> = FieldValidator<
    SchemaToValueType<Schema>
>;

/**
 * getValidate types end
 */
