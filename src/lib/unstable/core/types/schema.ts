import type {JsonSchemaType} from '../constants';

import type {SchemaRendererConfig} from './config';
import type {ViewComponentPropsByConfig, WrapperComponentPropsByConfig} from './helpers';
import type {ErrorMessages} from './validation';
import type {ArrayValue, FieldValue, ObjectValue} from './values';

interface EntityParameters<
    Config extends SchemaRendererConfig[JsonSchemaType] = SchemaRendererConfig[JsonSchemaType],
    ViewKey extends Exclude<keyof ViewComponentPropsByConfig<Config>, number> = Exclude<
        keyof ViewComponentPropsByConfig<Config>,
        number
    >,
    WrapperKey extends Exclude<keyof WrapperComponentPropsByConfig<Config>, number> = Exclude<
        keyof WrapperComponentPropsByConfig<Config>,
        number
    >,
> {
    entityParameters?: {
        enumDescription?: {
            [key: string]: string;
        };
        errorMessages?: ErrorMessages & {
            dependencies?: Record<string, string>;
            required?: Record<string, string>;
        }; // todo
        validatorType?: string;
        viewType?: ViewKey;
        viewProps?: ViewComponentPropsByConfig<Config>[ViewKey];
        wrapperType?: WrapperKey;
        wrapperProps?: {
            open?: boolean;
            hidden?: boolean;
            copy?: boolean;
            required?: boolean;
        } & WrapperComponentPropsByConfig<Config>[WrapperKey];
    };
}

interface JsonSchemaBase<Schema extends JsonSchema, ValueType extends FieldValue> {
    allOf?: Schema[];
    anyOf?: Schema[];
    const?: ValueType;
    default?: ValueType;
    description?: string;
    else?: Schema;
    enum?: ValueType[];
    examples?: ValueType[];
    if?: Schema;
    not?: Schema;
    oneOf?: Schema[];
    readOnly?: boolean;
    then?: Schema;
    title?: string;
    writeOnly?: boolean;
}

export interface JsonSchemaArray<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaArray, ArrayValue>,
        EntityParameters<Config[JsonSchemaType.Array]> {
    contains?: boolean | JsonSchema;
    items?: JsonSchema | JsonSchema[];
    maxItems?: number;
    minItems?: number;
    type: JsonSchemaType.Array;
    uniqueItems?: boolean;
}

export interface JsonSchemaBoolean<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaBoolean, boolean>,
        EntityParameters<Config[JsonSchemaType.Boolean]> {
    type: JsonSchemaType.Boolean;
}

export interface JsonSchemaNumber<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaNumber, number>,
        EntityParameters<Config[JsonSchemaType.Number]> {
    exclusiveMaximum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    minimum?: number;
    multipleOf?: number;
    type: JsonSchemaType.Number;
}

export interface JsonSchemaObject<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaObject, ObjectValue>,
        EntityParameters<Config[JsonSchemaType.Object]> {
    additionalProperties?: boolean | JsonSchema;
    dependencies?: {
        [key: string]: string[] | JsonSchemaObject;
    };
    maxProperties?: number;
    minProperties?: number;
    patternProperties?: {
        [key: string]: JsonSchema;
    };
    properties?: {
        [key: string]: JsonSchema;
    };
    propertyNames?: JsonSchema;
    required?: string[];
    type: JsonSchemaType.Object;
}

export interface JsonSchemaString<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaString, string>,
        EntityParameters<Config[JsonSchemaType.String]> {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    type: JsonSchemaType.String;
}

export type JsonSchema<Config extends SchemaRendererConfig = SchemaRendererConfig> =
    | JsonSchemaArray<Config>
    | JsonSchemaBoolean<Config>
    | JsonSchemaNumber<Config>
    | JsonSchemaObject<Config>
    | JsonSchemaString<Config>;
