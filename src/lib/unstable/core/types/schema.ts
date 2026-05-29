import type {JsonSchemaType} from '../constants';

import type {SchemaRendererConfig} from './config';
import type {
    ExtractControlProps,
    ExtractViewProps,
    ExtractWrapperProps,
    SchemaToSchemaType,
} from './helpers';
import type {ErrorMessages} from './validation';
import type {ArrayValue, FieldValue, ObjectValue} from './values';

interface EntityParameters<
    Config extends SchemaRendererConfig[JsonSchemaType] = SchemaRendererConfig[JsonSchemaType],
    ControlKey extends Exclude<keyof Config['controls'], number> = Exclude<
        keyof Config['controls'],
        number
    >,
    ViewKey extends Exclude<keyof Config['views'], number> = Exclude<keyof Config['views'], number>,
    WrapperKey extends Exclude<keyof Config['wrappers'], number> = Exclude<
        keyof Config['wrappers'],
        number
    >,
> {
    entityParameters?: {
        enumDescription?: {
            [key: string]: string;
        };
        errorMessages?: Omit<ErrorMessages, 'dependencies' | 'required'> & {
            dependencies?: string | Record<string, string>;
            required?: string | Record<string, string>;
        }; // todo
        controlType?: ControlKey;
        controlProps?: ExtractControlProps<Config['controls'][ControlKey]>;
        controlWrapperType?: WrapperKey;
        controlWrapperProps?: ExtractWrapperProps<Config['wrappers'][WrapperKey]>;
        viewType?: ViewKey;
        viewProps?: ExtractViewProps<Config['views'][ViewKey]>;
        viewWrapperType?: WrapperKey;
        viewWrapperProps?: ExtractWrapperProps<Config['wrappers'][WrapperKey]>;
        validatorType?: string;
    };
}

/**
 * Common JSON Schema keywords inherited by every concrete schema variant.
 */
interface JsonSchemaBase<
    Schema extends JsonSchema,
    Value extends FieldValue,
    Config extends SchemaRendererConfig = SchemaRendererConfig,
> extends EntityParameters<Config[SchemaToSchemaType<Schema>]> {
    /**
     * Unique URI identifier for the schema; serves as the base URI when resolving relative `$ref`s in nested sub-schemas.
     *
     * @example
     * { $id: 'https://example.com/schemas/person', type: JsonSchemaType.Object }
     */
    $id?: string;

    /**
     * URI or JSON Pointer to another schema; when resolved, the current schema is replaced by the referenced one.
     *
     * @example
     * { $ref: '#/$defs/positiveInt' }
     *
     * @example
     * { $ref: 'https://example.com/schemas/address' }
     */
    $ref?: string;

    /**
     * URI of the JSON Schema dialect (draft) this schema conforms to.
     *
     * @example
     * { $schema: 'https://json-schema.org/draft/2020-12/schema', type: JsonSchemaType.Object }
     */
    $schema?: string;

    /**
     * Free-form note for schema authors; not surfaced to end users by the renderer.
     *
     * @example
     * { type: JsonSchemaType.String, $comment: 'TODO: tighten validation once backend lands' }
     */
    $comment?: string;

    /**
     * Map of named, reusable sub-schemas referenced via `$ref` (draft-07 keyword; prefer `$defs` in newer drafts).
     *
     * @example
     * { definitions: { positiveInt: { type: JsonSchemaType.Number, minimum: 1 } } }
     */
    definitions?: {[key: string]: JsonSchema};

    /**
     * Map of named, reusable sub-schemas referenced via `$ref` (draft 2019-09+; replaces `definitions`).
     *
     * @example
     * { $defs: { name: { type: JsonSchemaType.String, minLength: 1 } } }
     */
    $defs?: {[key: string]: JsonSchema};

    /**
     * Short, human-readable label for the field; typically rendered as the form-control label.
     *
     * @example
     * { type: JsonSchemaType.String, title: 'First name' }
     */
    title?: string;

    /**
     * Longer, human-readable explanation of the field; typically rendered as helper text below the control.
     *
     * @example
     * { type: JsonSchemaType.String, description: 'As shown on your government-issued ID' }
     */
    description?: string;

    /**
     * Default value used when the field has not been supplied a value.
     *
     * @example
     * { type: JsonSchemaType.String, default: 'guest' }
     *
     * @example
     * { type: JsonSchemaType.Number, default: 0 }
     */
    default?: Value;

    /**
     * Sample values illustrating typical inputs; used for documentation and tooling, not for validation.
     *
     * @example
     * { type: JsonSchemaType.String, examples: ['alice@example.com', 'bob@example.com'] }
     */
    examples?: Value[];

    /**
     * Marks the field as read-only; the renderer displays the value but disables editing.
     *
     * @example
     * { type: JsonSchemaType.String, readOnly: true }
     */
    readOnly?: boolean;

    /**
     * Marks the field as write-only; the value is accepted on submission but never echoed back (e.g. passwords).
     *
     * @example
     * { type: JsonSchemaType.String, writeOnly: true }
     */
    writeOnly?: boolean;

    /**
     * Indicates the field is deprecated; the renderer may warn or hide it accordingly.
     *
     * @example
     * { type: JsonSchemaType.String, deprecated: true }
     */
    deprecated?: boolean;

    /**
     * Restricts the value to exactly one of the listed entries.
     *
     * @example
     * { type: JsonSchemaType.String, enum: ['draft', 'published', 'archived'] }
     *
     * @example
     * { type: JsonSchemaType.Number, enum: [1, 2, 3] }
     */
    enum?: Value[];

    /**
     * Restricts the value to exactly this single constant.
     *
     * @example
     * { type: JsonSchemaType.String, const: 'v1' }
     */
    const?: Value;

    /**
     * The value must satisfy every sub-schema in this list (logical AND).
     *
     * @example
     * { type: JsonSchemaType.String, allOf: [{ type: JsonSchemaType.String, minLength: 3 }, { type: JsonSchemaType.String, pattern: '^[a-z]+$' }] }
     */
    allOf?: Schema[];

    /**
     * The value must satisfy at least one sub-schema in this list (logical OR).
     *
     * @example
     * { anyOf: [{ type: JsonSchemaType.String }, { type: JsonSchemaType.Number }] }
     */
    anyOf?: Schema[];

    /**
     * The value must satisfy exactly one sub-schema in this list (logical XOR).
     *
     * @example
     * { type: JsonSchemaType.String, oneOf: [{ type: JsonSchemaType.String, maxLength: 5 }, { type: JsonSchemaType.String, minLength: 10 }] }
     */
    oneOf?: Schema[];

    /**
     * The value must NOT satisfy this sub-schema (logical NOT).
     *
     * @example
     * { type: JsonSchemaType.String, not: { type: JsonSchemaType.String, const: 'forbidden' } }
     */
    not?: Schema;

    /**
     * Conditional sub-schema; when the value satisfies it, `then` is applied, otherwise `else`.
     *
     * @example
     * { type: JsonSchemaType.String, if: { type: JsonSchemaType.String, const: 'ja' }, then: { type: JsonSchemaType.String, minLength: 5 }, else: { type: JsonSchemaType.String, minLength: 10 } }
     */
    if?: Schema;

    /**
     * Sub-schema applied when the `if` condition is satisfied.
     *
     * @example
     * { type: JsonSchemaType.String, if: { type: JsonSchemaType.String, const: 'ja' }, then: { type: JsonSchemaType.String, minLength: 5 } }
     */
    then?: Schema;

    /**
     * Sub-schema applied when the `if` condition is not satisfied.
     *
     * @example
     * { type: JsonSchemaType.String, if: { type: JsonSchemaType.String, const: 'ja' }, else: { type: JsonSchemaType.String, minLength: 10 } }
     */
    else?: Schema;
}

/**
 * Schema variant without an explicit `type` keyword. Matches values of any JSON type and accepts every keyword from the typed variants.
 */
export interface JsonSchemaAny<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchema, FieldValue, Config> {
    /**
     * Distinguishes this variant from typed schemas: when `type` is omitted, the schema matches values of any JSON type.
     *
     * @example
     * { enum: ['yes', 1, true] }
     */
    type?: undefined;

    /**
     * Shortest allowed length (in characters) when the value is a string; ignored for non-string values.
     *
     * @example
     * { minLength: 5 }
     */
    minLength?: number;

    /**
     * Longest allowed length (in characters) when the value is a string; ignored for non-string values.
     *
     * @example
     * { maxLength: 100 }
     */
    maxLength?: number;

    /**
     * Regular expression the value must match when it is a string; ignored for non-string values.
     *
     * @example
     * { pattern: '^[A-Z][a-z]+$' }
     */
    pattern?: string;

    /**
     * Semantic format the value must conform to when it is a string (e.g. `email`, `date`, `uri`).
     *
     * @example
     * { format: 'email' }
     *
     * @example
     * { format: 'date-time' }
     */
    format?: string;

    /**
     * Encoding used by the string value (e.g. `base64`); enables the parsed content to be validated by `contentSchema`.
     *
     * @example
     * { contentEncoding: 'base64', contentMediaType: 'image/png' }
     */
    contentEncoding?: string;

    /**
     * MIME type of the parsed string content; pairs with `contentEncoding` and `contentSchema`.
     *
     * @example
     * { contentMediaType: 'application/json' }
     */
    contentMediaType?: string;

    /**
     * Sub-schema validating the parsed content of a string described by `contentMediaType` / `contentEncoding`.
     *
     * @example
     * { contentMediaType: 'application/json', contentSchema: { type: JsonSchemaType.Object } }
     */
    contentSchema?: JsonSchema;

    /**
     * Smallest allowed numeric value (inclusive); ignored for non-numeric values.
     *
     * @example
     * { minimum: 0 }
     */
    minimum?: number;

    /**
     * Largest allowed numeric value (inclusive); ignored for non-numeric values.
     *
     * @example
     * { maximum: 100 }
     */
    maximum?: number;

    /**
     * Strict lower bound for numeric values (value must be greater than this); ignored for non-numeric values.
     *
     * @example
     * { exclusiveMinimum: 0 }
     */
    exclusiveMinimum?: number;

    /**
     * Strict upper bound for numeric values (value must be less than this); ignored for non-numeric values.
     *
     * @example
     * { exclusiveMaximum: 100 }
     */
    exclusiveMaximum?: number;

    /**
     * Numeric values must be an exact multiple of this number (supports fractional steppers); ignored for non-numeric values.
     *
     * @example
     * { multipleOf: 0.25 }
     */
    multipleOf?: number;

    /**
     * Schema (or positional tuple of schemas) that every array item must satisfy; ignored for non-array values.
     *
     * @example
     * { items: { type: JsonSchemaType.String } }
     *
     * @example
     * { items: [{ type: JsonSchemaType.String }, { type: JsonSchemaType.Number }] }
     */
    items?: JsonSchema | JsonSchema[];

    /**
     * Schema applied to array items beyond the positional tuple defined by `items`; ignored for non-array values.
     *
     * @example
     * { items: [{ type: JsonSchemaType.String }], additionalItems: { type: JsonSchemaType.Number } }
     */
    additionalItems?: JsonSchema;

    /**
     * Positional tuple of schemas validating the first N array items (draft 2020-12 replacement for tuple `items`).
     *
     * @example
     * { prefixItems: [{ type: JsonSchemaType.String }, { type: JsonSchemaType.Number }] }
     */
    prefixItems?: JsonSchema[];

    /**
     * Schema applied to array items not validated by `items` or `prefixItems` (draft 2019-09+).
     *
     * @example
     * { prefixItems: [{ type: JsonSchemaType.String }], unevaluatedItems: { type: JsonSchemaType.Number } }
     */
    unevaluatedItems?: JsonSchema;

    /**
     * Sub-schema that at least one array item must satisfy; ignored for non-array values.
     *
     * @example
     * { contains: { type: JsonSchemaType.Number, minimum: 5 } }
     */
    contains?: JsonSchema;

    /**
     * Minimum number of array items that must satisfy `contains`.
     *
     * @example
     * { contains: { type: JsonSchemaType.Number }, minContains: 2 }
     */
    minContains?: number;

    /**
     * Maximum number of array items that may satisfy `contains`.
     *
     * @example
     * { contains: { type: JsonSchemaType.Number }, maxContains: 3 }
     */
    maxContains?: number;

    /**
     * Minimum number of items the array must contain; ignored for non-array values.
     *
     * @example
     * { minItems: 1 }
     */
    minItems?: number;

    /**
     * Maximum number of items the array may contain; ignored for non-array values.
     *
     * @example
     * { maxItems: 10 }
     */
    maxItems?: number;

    /**
     * When true, every array item must be unique; ignored for non-array values.
     *
     * @example
     * { uniqueItems: true }
     */
    uniqueItems?: boolean;

    /**
     * Map of property name to schema; defines the validated sub-schema for each named property of an object value.
     *
     * @example
     * { properties: { name: { type: JsonSchemaType.String } } }
     */
    properties?: {[key: string]: JsonSchema};

    /**
     * Map of regular expression to schema; properties whose name matches a pattern must satisfy the corresponding schema.
     *
     * @example
     * { patternProperties: { '^x-': { type: JsonSchemaType.String } } }
     */
    patternProperties?: {[key: string]: JsonSchema};

    /**
     * Schema applied to object properties not listed in `properties` and not matched by `patternProperties`.
     *
     * @example
     * { properties: { name: { type: JsonSchemaType.String } }, additionalProperties: { type: JsonSchemaType.Number } }
     */
    additionalProperties?: JsonSchema;

    /**
     * Schema applied to object properties not already validated by `properties`, `patternProperties`, or `additionalProperties` (draft 2019-09+).
     *
     * @example
     * { properties: { name: { type: JsonSchemaType.String } }, unevaluatedProperties: { type: JsonSchemaType.Number } }
     */
    unevaluatedProperties?: JsonSchema;

    /**
     * Schema each property name must satisfy (typically a `type: string` schema constraining length or pattern).
     *
     * @example
     * { propertyNames: { type: JsonSchemaType.String, pattern: '^[a-z][a-zA-Z0-9]*$' } }
     */
    propertyNames?: JsonSchema;

    /**
     * Names of properties that must be present on the object value.
     *
     * @example
     * { properties: { name: { type: JsonSchemaType.String } }, required: ['name'] }
     */
    required?: string[];

    /**
     * Minimum number of properties the object must declare; ignored for non-object values.
     *
     * @example
     * { minProperties: 1 }
     */
    minProperties?: number;

    /**
     * Maximum number of properties the object may declare; ignored for non-object values.
     *
     * @example
     * { maxProperties: 5 }
     */
    maxProperties?: number;

    /**
     * Property-level dependencies: when a key is present, either the listed property names must also be present, or the given sub-schema must hold for the whole object (draft-07 keyword).
     *
     * @example
     * { dependencies: { credit_card: ['billing_address'] } }
     *
     * @example
     * { dependencies: { credit_card: { type: JsonSchemaType.Object, required: ['billing_address'] } } }
     */
    dependencies?: {[key: string]: string[] | JsonSchema};

    /**
     * When the keyed property is present, the listed property names are also required (draft 2019-09+; replaces the array form of `dependencies`).
     *
     * @example
     * { dependentRequired: { credit_card: ['billing_address'] } }
     */
    dependentRequired?: {[key: string]: string[]};

    /**
     * When the keyed property is present, the additional sub-schema must hold for the whole object (draft 2019-09+; replaces the schema form of `dependencies`).
     *
     * @example
     * { dependentSchemas: { credit_card: { type: JsonSchemaType.Object, required: ['billing_address'] } } }
     */
    dependentSchemas?: {[key: string]: JsonSchema};
}

/**
 * Schema for array values (`type: JsonSchemaType.Array`).
 */
export interface JsonSchemaArray<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaArray, ArrayValue, Config> {
    /**
     * Marks this schema as describing an array value.
     *
     * @example
     * { type: JsonSchemaType.Array, items: { type: JsonSchemaType.String } }
     */
    type: JsonSchemaType.Array;

    /**
     * Schema (or positional tuple of schemas) that every array item must satisfy.
     *
     * @example
     * { type: JsonSchemaType.Array, items: { type: JsonSchemaType.String } }
     *
     * @example
     * { type: JsonSchemaType.Array, items: [{ type: JsonSchemaType.String }, { type: JsonSchemaType.Number }] }
     */
    items?: JsonSchema | JsonSchema[];

    /**
     * Schema applied to array items beyond the positional tuple defined by `items`.
     *
     * @example
     * { type: JsonSchemaType.Array, items: [{ type: JsonSchemaType.String }], additionalItems: { type: JsonSchemaType.Number } }
     */
    additionalItems?: JsonSchema;

    /**
     * Positional tuple of schemas validating the first N array items (draft 2020-12 replacement for tuple `items`).
     *
     * @example
     * { type: JsonSchemaType.Array, prefixItems: [{ type: JsonSchemaType.String }, { type: JsonSchemaType.Number }] }
     */
    prefixItems?: JsonSchema[];

    /**
     * Schema applied to array items not already validated by `items` or `prefixItems` (draft 2019-09+).
     *
     * @example
     * { type: JsonSchemaType.Array, prefixItems: [{ type: JsonSchemaType.String }], unevaluatedItems: { type: JsonSchemaType.Number } }
     */
    unevaluatedItems?: JsonSchema;

    /**
     * Sub-schema that at least one array item must satisfy.
     *
     * @example
     * { type: JsonSchemaType.Array, contains: { type: JsonSchemaType.Number, minimum: 5 } }
     */
    contains?: JsonSchema;

    /**
     * Minimum number of array items that must satisfy `contains`.
     *
     * @example
     * { type: JsonSchemaType.Array, contains: { type: JsonSchemaType.Number }, minContains: 2 }
     */
    minContains?: number;

    /**
     * Maximum number of array items that may satisfy `contains`.
     *
     * @example
     * { type: JsonSchemaType.Array, contains: { type: JsonSchemaType.Number }, maxContains: 3 }
     */
    maxContains?: number;

    /**
     * Minimum number of items the array must contain.
     *
     * @example
     * { type: JsonSchemaType.Array, minItems: 1 }
     */
    minItems?: number;

    /**
     * Maximum number of items the array may contain.
     *
     * @example
     * { type: JsonSchemaType.Array, maxItems: 10 }
     */
    maxItems?: number;

    /**
     * When true, every array item must be unique.
     *
     * @example
     * { type: JsonSchemaType.Array, items: { type: JsonSchemaType.String }, uniqueItems: true }
     */
    uniqueItems?: boolean;
}

/**
 * Schema for boolean values (`type: JsonSchemaType.Boolean`).
 */
export interface JsonSchemaBoolean<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaBoolean, boolean, Config> {
    /**
     * Marks this schema as describing a boolean value.
     *
     * @example
     * { type: JsonSchemaType.Boolean, default: false }
     */
    type: JsonSchemaType.Boolean;
}

/**
 * Schema for numeric values (`type: JsonSchemaType.Number`).
 */
export interface JsonSchemaNumber<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaNumber, number, Config> {
    /**
     * Marks this schema as describing a numeric value.
     *
     * @example
     * { type: JsonSchemaType.Number, minimum: 0, maximum: 100 }
     */
    type: JsonSchemaType.Number;

    /**
     * Smallest allowed value (inclusive).
     *
     * @example
     * { type: JsonSchemaType.Number, minimum: 0 }
     */
    minimum?: number;

    /**
     * Largest allowed value (inclusive).
     *
     * @example
     * { type: JsonSchemaType.Number, maximum: 100 }
     */
    maximum?: number;

    /**
     * Strict lower bound (value must be greater than this).
     *
     * @example
     * { type: JsonSchemaType.Number, exclusiveMinimum: 0 }
     */
    exclusiveMinimum?: number;

    /**
     * Strict upper bound (value must be less than this).
     *
     * @example
     * { type: JsonSchemaType.Number, exclusiveMaximum: 100 }
     */
    exclusiveMaximum?: number;

    /**
     * Value must be an exact multiple of this number (supports fractional steppers like `0.25`).
     *
     * @example
     * { type: JsonSchemaType.Number, multipleOf: 0.5 }
     *
     * @example
     * { type: JsonSchemaType.Number, multipleOf: 10 }
     */
    multipleOf?: number;
}

/**
 * Schema for object values (`type: JsonSchemaType.Object`).
 */
export interface JsonSchemaObject<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaObject, ObjectValue, Config> {
    /**
     * Marks this schema as describing an object value.
     *
     * @example
     * { type: JsonSchemaType.Object, properties: { name: { type: JsonSchemaType.String } } }
     */
    type: JsonSchemaType.Object;

    /**
     * Map of property name to schema; defines the validated sub-schema for each named property.
     *
     * @example
     * { type: JsonSchemaType.Object, properties: { name: { type: JsonSchemaType.String }, age: { type: JsonSchemaType.Number } } }
     */
    properties?: {[key: string]: JsonSchema};

    /**
     * Map of regular expression to schema; properties whose name matches a pattern must satisfy the corresponding schema.
     *
     * @example
     * { type: JsonSchemaType.Object, patternProperties: { '^x-': { type: JsonSchemaType.String } } }
     */
    patternProperties?: {[key: string]: JsonSchema};

    /**
     * Schema applied to properties not listed in `properties` and not matched by `patternProperties`.
     *
     * @example
     * { type: JsonSchemaType.Object, properties: { name: { type: JsonSchemaType.String } }, additionalProperties: { type: JsonSchemaType.Number } }
     */
    additionalProperties?: JsonSchema;

    /**
     * Schema applied to properties not already validated by `properties`, `patternProperties`, or `additionalProperties` (draft 2019-09+).
     *
     * @example
     * { type: JsonSchemaType.Object, properties: { name: { type: JsonSchemaType.String } }, unevaluatedProperties: { type: JsonSchemaType.Number } }
     */
    unevaluatedProperties?: JsonSchema;

    /**
     * Schema each property name must satisfy (typically a `type: string` schema constraining length or pattern).
     *
     * @example
     * { type: JsonSchemaType.Object, propertyNames: { type: JsonSchemaType.String, pattern: '^[a-z][a-zA-Z0-9]*$' } }
     */
    propertyNames?: JsonSchema;

    /**
     * Names of properties that must be present on the object value.
     *
     * @example
     * { type: JsonSchemaType.Object, properties: { name: { type: JsonSchemaType.String } }, required: ['name'] }
     */
    required?: string[];

    /**
     * Minimum number of properties the object must declare.
     *
     * @example
     * { type: JsonSchemaType.Object, minProperties: 1 }
     */
    minProperties?: number;

    /**
     * Maximum number of properties the object may declare.
     *
     * @example
     * { type: JsonSchemaType.Object, maxProperties: 5 }
     */
    maxProperties?: number;

    /**
     * Property-level dependencies: when a key is present, either the listed property names must also be present, or the given sub-schema must hold for the whole object (draft-07 keyword).
     *
     * @example
     * { type: JsonSchemaType.Object, dependencies: { credit_card: ['billing_address'] } }
     *
     * @example
     * { type: JsonSchemaType.Object, dependencies: { credit_card: { type: JsonSchemaType.Object, required: ['billing_address'] } } }
     */
    dependencies?: {[key: string]: string[] | JsonSchema};

    /**
     * When the keyed property is present, the listed property names are also required (draft 2019-09+; replaces the array form of `dependencies`).
     *
     * @example
     * { type: JsonSchemaType.Object, dependentRequired: { credit_card: ['billing_address'] } }
     */
    dependentRequired?: {[key: string]: string[]};

    /**
     * When the keyed property is present, the additional sub-schema must hold for the whole object (draft 2019-09+; replaces the schema form of `dependencies`).
     *
     * @example
     * { type: JsonSchemaType.Object, dependentSchemas: { credit_card: { type: JsonSchemaType.Object, required: ['billing_address'] } } }
     */
    dependentSchemas?: {[key: string]: JsonSchema};
}

/**
 * Schema for string values (`type: JsonSchemaType.String`).
 */
export interface JsonSchemaString<Config extends SchemaRendererConfig = SchemaRendererConfig>
    extends JsonSchemaBase<JsonSchemaString, string, Config> {
    /**
     * Marks this schema as describing a string value.
     *
     * @example
     * { type: JsonSchemaType.String, minLength: 1 }
     */
    type: JsonSchemaType.String;

    /**
     * Shortest allowed length (in characters) of the string value.
     *
     * @example
     * { type: JsonSchemaType.String, minLength: 5 }
     */
    minLength?: number;

    /**
     * Longest allowed length (in characters) of the string value.
     *
     * @example
     * { type: JsonSchemaType.String, maxLength: 100 }
     */
    maxLength?: number;

    /**
     * Regular expression the string value must match.
     *
     * @example
     * { type: JsonSchemaType.String, pattern: '^[A-Z][a-z]+$' }
     *
     * @example
     * { type: JsonSchemaType.String, pattern: '[0-9]' }
     */
    pattern?: string;

    /**
     * Semantic format the string value must conform to (e.g. `email`, `date`, `uri`); enforcement depends on the configured validator.
     *
     * @example
     * { type: JsonSchemaType.String, format: 'email' }
     *
     * @example
     * { type: JsonSchemaType.String, format: 'date-time' }
     */
    format?: string;

    /**
     * Encoding used by the string value (e.g. `base64`); enables the parsed content to be validated by `contentSchema`.
     *
     * @example
     * { type: JsonSchemaType.String, contentEncoding: 'base64', contentMediaType: 'image/png' }
     */
    contentEncoding?: string;

    /**
     * MIME type of the parsed string content; pairs with `contentEncoding` and `contentSchema`.
     *
     * @example
     * { type: JsonSchemaType.String, contentMediaType: 'application/json' }
     */
    contentMediaType?: string;

    /**
     * Sub-schema validating the parsed content of a string described by `contentMediaType` / `contentEncoding`.
     *
     * @example
     * { type: JsonSchemaType.String, contentMediaType: 'application/json', contentSchema: { type: JsonSchemaType.Object } }
     */
    contentSchema?: JsonSchema;
}

/**
 * Discriminated union of every supported JSON Schema variant. Narrow with the `type` keyword to access type-specific fields.
 *
 * @example
 * const schema: JsonSchema = { type: JsonSchemaType.String, minLength: 1 };
 *
 * @example
 * const schema: JsonSchema = { type: JsonSchemaType.Object, properties: { id: { type: JsonSchemaType.Number } } };
 */
export type JsonSchema =
    | JsonSchemaAny
    | JsonSchemaArray
    | JsonSchemaBoolean
    | JsonSchemaNumber
    | JsonSchemaObject
    | JsonSchemaString;
