import type {Annotation, AnnotationData} from 'json-schema-library';

import type {JsonSchema} from './schema';
import type {Validator} from './validation';

type JSLError<
    Code extends string,
    Data extends Record<string, unknown> = Record<string, unknown>,
> = Annotation<'error', AnnotationData<Data>, Code>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSLErrors {
    export type AdditionalItems = JSLError<'additional-items-error', {key: number}>;

    export type AdditionalProperties = JSLError<
        'no-additional-properties-error',
        {properties: string[]; property: string}
    >;

    export type AnyOf = JSLError<'any-of-error', {anyOf: JsonSchema[]}>;

    export type Const = JSLError<'const-error', {expected: unknown}>;

    export type ContainsAny = JSLError<'contains-any-error'>;

    export type ContainsMin = JSLError<'contains-min-error', {delta: number}>;

    export type Dependencies = JSLError<'missing-dependency-error', {missingProperty: string}>;

    export type Enum = JSLError<'enum-error', {values: unknown[]}>;

    export type ExclusiveMaximum = JSLError<
        'exclusive-maximum-error',
        {length: number | string; maximum: number | string}
    >;

    export type ExclusiveMinimum = JSLError<
        'exclusive-minimum-error',
        {length: number | string; minimum: number | string}
    >;

    export type MaxItems = JSLError<'max-items-error', {length: number; maximum: number}>;

    export type MaxLength = JSLError<'max-length-error', {length: number; maxLength: number}>;

    export type MaxProperties = JSLError<
        'max-properties-error',
        {length: number; maxProperties: number}
    >;

    export type Maximum = JSLError<
        'maximum-error',
        {length: number | string; maximum: number | string}
    >;

    export type MinItems = JSLError<'min-items-error', {length: number; minItems: number}>;

    export type MinLength = JSLError<'min-length-error', {length: number; minLength: number}>;

    export type MinProperties = JSLError<
        'min-properties-error',
        {length: number; minProperties: number}
    >;

    export type Minimum = JSLError<
        'minimum-error',
        {length: number | string; minimum: number | string}
    >;

    export type MultipleOf = JSLError<'multiple-of-error', {multipleOf: number | string}>;

    export type NodeParameters = JSLError<
        'node-parameters-error',
        {validator: Validator<JsonSchema>}
    >;

    export type Not = JSLError<'not-error', {not: JsonSchema}>;

    export type OneOf = JSLError<'one-of-error', {errors: JSLErrors.Error[]; oneOf: JsonSchema[]}>;

    export type Pattern = JSLError<
        'pattern-error',
        {description: string; pattern: string; received: string}
    >;

    export type PropertyNames = JSLError<
        'invalid-property-name-error',
        {property: string; validationError: JSLErrors.Error}
    >;

    export type Required = JSLError<'required-property-error', {key: string}>;

    export type Type = JSLError<'type-error', {expected: string; received: string}>;

    export type UniqueItems = JSLError<
        'unique-items-error',
        {arrayPointer: string; duplicatePointer: string}
    >;

    export type Error =
        | AdditionalItems
        | AdditionalProperties
        | AnyOf
        | Const
        | ContainsAny
        | ContainsMin
        | Dependencies
        | Enum
        | ExclusiveMaximum
        | ExclusiveMinimum
        | MaxItems
        | MaxLength
        | MaxProperties
        | Maximum
        | MinItems
        | MinLength
        | MinProperties
        | Minimum
        | MultipleOf
        | NodeParameters
        | Not
        | OneOf
        | Pattern
        | PropertyNames
        | Required
        | Type
        | UniqueItems;

    export type ErrorCode = Error['code'];
}
