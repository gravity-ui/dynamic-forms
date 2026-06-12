import type {EntityType, JsonSchemaType} from '../constants';

import type {SchemaRendererConfig} from './config';
import type {
    ExtractControlProps,
    ExtractViewProps,
    ExtractWrapperProps,
    ObjectKeys,
} from './helpers';
import type {ErrorMessages} from './validation';
import type {ArrayValue, FieldValue, ObjectValue} from './values';

/**
 * Renderer-specific configuration carried on each schema node. Not part of the
 * JSON Schema specification — these keywords are ignored by JSON Schema
 * validators and consumed only by SchemaRenderer to choose controls, views,
 * wrappers, validators, and custom error messages for the field.
 *
 * Generic parameters bind the available `controlType` / `viewType` /
 * `wrapperType` / `validatorType` values to those registered in the
 * `SchemaRendererConfig` for this entity type — making invalid identifiers a
 * TypeScript error at the schema declaration site.
 */
interface EntityParameters<
    Type extends EntityType,
    TypeConfig extends SchemaRendererConfig[Type],
    Control extends ObjectKeys<TypeConfig['controls']> = ObjectKeys<TypeConfig['controls']>,
    View extends ObjectKeys<TypeConfig['views']> = ObjectKeys<TypeConfig['views']>,
    Wrapper extends ObjectKeys<TypeConfig['wrappers']> = ObjectKeys<TypeConfig['wrappers']>,
    Validator extends ObjectKeys<TypeConfig['validators']> = ObjectKeys<TypeConfig['validators']>,
> {
    /**
     * Optional bag of renderer-specific configuration for this schema node.
     * Ignored by JSON Schema validators.
     */
    entityParameters?: {
        /**
         * Forces the renderer to treat this node as a specific `EntityType`, overriding
         * the inference based on the JSON Schema `type` keyword. Useful when a single
         * JSON type should be rendered as multiple kinds of UI (e.g. `String` rendered
         * via different `EntityType` registrations).
         */
        type?: Type;
        /**
         * Identifier of a control registered in `config[entityType].controls`. Selects
         * which React component renders the field in form mode. When omitted, the
         * renderer falls back to the default control for this entity type.
         */
        controlType?: Control;
        /**
         * Extra props forwarded to the selected control. Typed to the `controlProps`
         * shape declared by the chosen control component.
         */
        controlProps?: ExtractControlProps<TypeConfig['controls'][Control]>;
        /**
         * Identifier of a wrapper registered in `config[entityType].wrappers`. The
         * wrapper component is rendered around the control in form mode (e.g. to add
         * a label, layout, or visibility logic).
         */
        controlWrapperType?: Wrapper;
        /**
         * Extra props forwarded to the selected control wrapper. Typed to the
         * `wrapperProps` shape declared by the chosen wrapper component.
         */
        controlWrapperProps?: ExtractWrapperProps<TypeConfig['wrappers'][Wrapper]>;
        /**
         * Identifier of a view registered in `config[entityType].views`. Selects which
         * React component renders the field in overview (read-only) mode. When omitted,
         * the renderer falls back to the default view for this entity type.
         */
        viewType?: View;
        /**
         * Extra props forwarded to the selected view. Typed to the `viewProps` shape
         * declared by the chosen view component.
         */
        viewProps?: ExtractViewProps<TypeConfig['views'][View]>;
        /**
         * Identifier of a wrapper registered in `config[entityType].wrappers`. The
         * wrapper component is rendered around the view in overview mode.
         */
        viewWrapperType?: Wrapper;
        /**
         * Extra props forwarded to the selected view wrapper. Typed to the
         * `wrapperProps` shape declared by the chosen wrapper component.
         */
        viewWrapperProps?: ExtractWrapperProps<TypeConfig['wrappers'][Wrapper]>;
        /**
         * Identifier of a custom validator registered in `config[entityType].validators`.
         * Runs in addition to (or instead of, depending on the renderer policy) the
         * JSON Schema validation derived from the schema keywords.
         *
         * TODO(verify): confirm whether the custom validator replaces or complements
         * JSON Schema validation and adjust this comment.
         */
        validatorType?: Validator;
        /**
         * Map of enum value (as a string key) to a human-readable label. The renderer
         * uses these labels in selects / radio groups instead of showing raw enum values.
         *
         * @example
         * {
         *   enum: ['draft', 'published'],
         *   entityParameters: {
         *     enumDescription: {draft: 'Draft', published: 'Published'},
         *   },
         * }
         */
        enumDescription?: {[key: string]: string};
        /**
         * Custom error messages shown by the renderer when validation fails. Keys
         * correspond to JSON Schema validation keywords (`minLength`, `pattern`, `enum`,
         * etc.).
         *
         * `dependencies` and `required` accept either a single string (used for any
         * failure of that keyword) or a `Record<string, string>` mapping the dependent /
         * required property name to its own message.
         *
         * Not part of the JSON Schema specification — purely a UI override for this
         * renderer.
         *
         * @example
         * {
         *   type: JsonSchemaType.String,
         *   minLength: 5,
         *   entityParameters: {
         *     errorMessages: {minLength: 'Must be at least 5 characters'},
         *   },
         * }
         *
         * @example
         * // Per-property message for required.
         * {
         *   type: JsonSchemaType.Object,
         *   required: ['name', 'email'],
         *   entityParameters: {
         *     errorMessages: {
         *       required: {name: 'Name is required', email: 'Email is required'},
         *     },
         *   },
         * }
         */
        errorMessages?: Omit<ErrorMessages, 'dependencies' | 'required'> & {
            dependencies?: string | Record<string, string>;
            required?: string | Record<string, string>;
        };
    };
}

/**
 * Common JSON Schema keywords inherited by every concrete schema variant.
 */
interface JsonSchemaBase<
    Config extends SchemaRendererConfig,
    Schema extends JsonSchema<Config>,
    Value extends FieldValue,
> {
    /**
     * Unique URI identifier for the schema; establishes the base URI used to resolve
     * relative `$ref`s in all nested sub-schemas.
     *
     * May be an absolute URI, a relative URI (resolved against the parent `$id`), or
     * a fragment-only anchor (e.g. `#address`) — the anchor form lets `$ref: '#address'`
     * point at this schema from anywhere in the document.
     *
     * @example
     * { $id: 'https://example.com/schemas/person' }
     *
     * @example
     * // Anchor form: nested schemas can reference it via `{ $ref: '#address' }`.
     * { $id: '#address', type: JsonSchemaType.Object }
     *
     * @see https://json-schema.org/draft-07/json-schema-core.html#rfc.section.8.2
     */
    $id?: string;

    /**
     * URI reference to another schema. Resolved against the nearest enclosing `$id`
     * (or the document URI). Targets may be in `definitions`, but also any nested
     * sub-schema reachable by JSON Pointer.
     *
     * Draft-07 behaviour: when `$ref` is present, all sibling keywords in the same
     * object (including `title`, `description`, and validation keywords) are
     * **ignored** by the validator. This changed in Draft-2019-09, but the project
     * targets Draft-07 — combining `$ref` with siblings will silently lose them.
     *
     * @example
     * // JSON Pointer into definitions.
     * { $ref: '#/definitions/positiveInt' }
     *
     * @example
     * // JSON Pointer into the middle of the schema tree.
     * { $ref: '#/properties/user/properties/address' }
     *
     * @example
     * // External document.
     * { $ref: 'https://example.com/schemas/address.json' }
     *
     * @see https://json-schema.org/draft-07/json-schema-core.html#rfc.section.8.3
     */
    $ref?: string;

    /**
     * Logical AND: the value must validate against every sub-schema in the list.
     *
     * Useful for composing reusable constraints (typically declared in `definitions`)
     * onto a base schema. In typed variants (e.g. `JsonSchemaString`), the entries
     * are narrowed to the same variant by design — heterogeneous composition is not
     * representable.
     *
     * @example
     * {
     *   type: JsonSchemaType.String,
     *   allOf: [{minLength: 3}, {pattern: '^[a-z]+$'}],
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.7.1
     */
    allOf?: Schema[];

    /**
     * Logical OR: the value must validate against at least one sub-schema in the list.
     *
     * Unlike `oneOf`, no uniqueness check — the first match is enough. Prefer `anyOf`
     * when overlap between branches is acceptable; prefer `oneOf` when branches are
     * disjoint and you want a "discriminated union" semantics.
     *
     * @example
     * { anyOf: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.7.2
     */
    anyOf?: Schema[];

    /**
     * Restricts the value to exactly this constant. Equivalent to `enum: [const]`.
     *
     * Comparison is deep structural equality — works for primitives, arrays, objects,
     * and `null`. Two different object instances with the same shape both match.
     *
     * @example
     * { type: JsonSchemaType.String, const: 'v1' }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.1.3
     */
    const?: Value;

    /**
     * Default value associated with the schema.
     *
     * In the JSON Schema specification this is an **annotation**, not a validation
     * keyword — validators do not modify values by themselves. The SchemaRenderer
     * uses it to seed the initial form value when none is supplied.
     *
     * Note: `default: null` is a present default of `null`, not "no default".
     *
     * TODO(verify): confirm exact application point in `useSchemaRenderer` and
     * adjust this comment if the runtime treats `default` differently.
     *
     * @example
     * { type: JsonSchemaType.String, default: 'guest' }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.10.2
     */
    default?: Value;

    /**
     * Map of reusable named sub-schemas. Each entry is referenced via
     * `$ref: '#/definitions/<key>'` from anywhere in the document.
     *
     * Renamed to `$defs` starting in Draft-2019-09; the project targets Draft-07,
     * so `definitions` is the canonical form.
     *
     * @example
     * {
     *   definitions: {
     *     positiveInt: {type: JsonSchemaType.Number, minimum: 1},
     *   },
     *   properties: {
     *     age: {$ref: '#/definitions/positiveInt'},
     *   },
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.9
     */
    definitions?: {[key: string]: JsonSchema<Config>};

    /**
     * Longer human-readable explanation of the schema. The SchemaRenderer renders it
     * as helper/hint text near the control.
     *
     * Annotation only — not used for validation.
     *
     * @example
     * { type: JsonSchemaType.String, description: 'As shown on your government-issued ID' }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.10.1
     */
    description?: string;

    /**
     * Sub-schema applied when the value does **not** satisfy the `if` schema.
     *
     * Has no effect unless paired with `if`. If both `then` and `else` are omitted,
     * `if` is a no-op for validation.
     *
     * @example
     * {
     *   if: {properties: {locale: {const: 'ja'}}},
     *   then: {required: ['kanjiName']},
     *   else: {required: ['latinName']},
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.6.3
     */
    else?: Schema;

    /**
     * Restricts the value to exactly one of the listed entries.
     *
     * Comparison is deep structural equality — entries may be primitives, arrays,
     * objects, or `null`. In typed variants the entries are narrowed to the variant's
     * value type (e.g. `string[]` for `JsonSchemaString`); for nullable fields,
     * include `null` explicitly when needed.
     *
     * @example
     * { type: JsonSchemaType.String, enum: ['draft', 'published', 'archived'] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.1.2
     */
    enum?: Value[];

    /**
     * Sample values illustrating typical inputs. Annotation only — not used for
     * validation.
     *
     * TODO(verify): document whether and where the SchemaRenderer surfaces examples
     * in the UI; adjust the comment to match.
     *
     * @example
     * { type: JsonSchemaType.String, examples: ['alice@example.com', 'bob@example.com'] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.10.4
     */
    examples?: Value[];

    /**
     * Conditional sub-schema used together with `then` / `else`. Switches which
     * branch is applied, but is **not** itself a validation constraint — if the
     * value fails `if`, validation does not fail; it only routes to `else`.
     *
     * Without `then` or `else`, `if` is a no-op.
     *
     * @example
     * {
     *   if: {properties: {locale: {const: 'ja'}}},
     *   then: {required: ['kanjiName']},
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.6.1
     */
    if?: Schema;

    /**
     * Logical NOT: the value must **not** validate against this sub-schema.
     *
     * Common pitfall: `not: {}` disallows every value (the empty schema accepts
     * everything, so its negation accepts nothing).
     *
     * @example
     * { type: JsonSchemaType.String, not: {const: 'forbidden'} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.7.4
     */
    not?: Schema;

    /**
     * Logical XOR: the value must validate against **exactly one** sub-schema —
     * matching zero or two-or-more fails.
     *
     * Use for discriminated-union semantics where branches are disjoint. If
     * branches overlap, prefer `anyOf` — `oneOf` will reject values that match
     * more than one branch.
     *
     * @example
     * {
     *   oneOf: [
     *     {type: JsonSchemaType.String, maxLength: 5},
     *     {type: JsonSchemaType.String, minLength: 10},
     *   ],
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.7.3
     */
    oneOf?: Schema[];

    /**
     * Marks the value as read-only. Per the JSON Schema spec this is an annotation;
     * the SchemaRenderer disables the control for editing but keeps the existing
     * value in the form payload.
     *
     * @example
     * { type: JsonSchemaType.String, readOnly: true }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.10.3
     */
    readOnly?: boolean;

    /**
     * Sub-schema applied when the value satisfies the `if` schema. Has no effect
     * unless paired with `if`.
     *
     * @example
     * {
     *   if: {properties: {locale: {const: 'ja'}}},
     *   then: {required: ['kanjiName']},
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.6.2
     */
    then?: Schema;

    /**
     * Short human-readable label for the schema. The SchemaRenderer renders it as
     * the control's label; when omitted, the property name is typically used as a
     * fallback.
     *
     * Annotation only — not used for validation.
     *
     * @example
     * { type: JsonSchemaType.String, title: 'First name' }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.10.1
     */
    title?: string;

    /**
     * Marks the value as write-only — meant to be submitted but not echoed back
     * (e.g. passwords). The SchemaRenderer typically hides the value in overview /
     * read mode while still accepting input in form mode.
     *
     * @example
     * { type: JsonSchemaType.String, writeOnly: true }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.10.3
     */
    writeOnly?: boolean;
}

/**
 * Schema variant without an explicit `type` keyword. Matches values of any JSON type and accepts every keyword from the typed variants.
 */
export interface JsonSchemaAny<Config extends SchemaRendererConfig = any>
    extends JsonSchemaBase<Config, JsonSchema<Config>, FieldValue>,
        EntityParameters<EntityType.Any, Config[EntityType.Any]> {
    /**
     * Optional declared JSON type(s). When omitted, the schema matches any JSON type
     * and every keyword from the typed variants is accepted (each behaving according
     * to the actual runtime type — see "ignored for non-X values" below).
     *
     * A string array narrows to a union of allowed types. Include `JsonSchemaType.Null`
     * to allow `null` values.
     *
     * @example
     * // Matches any value, but constrains it to one of a few specific values.
     * { enum: ['yes', 1, true] }
     *
     * @example
     * // Union — string or null.
     * { type: [JsonSchemaType.String, JsonSchemaType.Null] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.1.1
     */
    type?: JsonSchemaType | JsonSchemaType[];

    /**
     * Schema applied to array items beyond the positional tuple defined by `items`;
     * ignored for non-array values, and ignored entirely when `items` is a single
     * schema (only meaningful when `items` is an array — tuple validation).
     *
     * - `true` (default if omitted): any additional items are allowed.
     * - `false`: array length must not exceed the tuple defined by `items`.
     * - schema: every additional item must validate against it.
     *
     * @example
     * // Tuple of one string; no further items allowed.
     * { items: [{type: JsonSchemaType.String}], additionalItems: false }
     *
     * @example
     * // Tuple of one string; further items must be numbers.
     * { items: [{type: JsonSchemaType.String}], additionalItems: {type: JsonSchemaType.Number} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.2
     */
    additionalItems?: JsonSchema<Config> | boolean;

    /**
     * Schema applied to object properties not listed in `properties` and not matched
     * by any `patternProperties` key; ignored for non-object values.
     *
     * - `true` (default if omitted): any extra properties are allowed.
     * - `false`: extra properties cause validation to fail.
     * - schema: every extra property's value must validate against it.
     *
     * Interacts with `properties` and `patternProperties` — a property is "additional"
     * only if it matches **neither** set.
     *
     * @example
     * { properties: {name: {type: JsonSchemaType.String}}, additionalProperties: false }
     *
     * @example
     * { properties: {name: {type: JsonSchemaType.String}}, additionalProperties: {type: JsonSchemaType.Number} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.6
     */
    additionalProperties?: JsonSchema<Config> | boolean;

    /**
     * Sub-schema that **at least one** array item must satisfy; ignored for non-array
     * values. An empty array always fails `contains`.
     *
     * Draft-07 note: per the spec the value must be a schema; the `boolean` form is
     * a Draft-2019-09 addition (`true` accepts any non-empty array, `false` always
     * fails). The current `boolean` typing here is more permissive than Draft-07.
     *
     * @example
     * { contains: {type: JsonSchemaType.Number, minimum: 5} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.6
     */
    contains?: JsonSchema<Config> | boolean;

    /**
     * Property dependencies on an object value; ignored for non-object values.
     * Each key triggers a constraint only when that property is present in the value.
     *
     * Two forms per entry:
     * - `string[]` — the listed property names must also be present.
     * - schema — the whole object must additionally validate against the given schema.
     *
     * Split into `dependentRequired` and `dependentSchemas` in Draft-2019-09 — the
     * project targets Draft-07, so the combined form is used here.
     *
     * @example
     * // Required-name form.
     * { dependencies: {credit_card: ['billing_address']} }
     *
     * @example
     * // Schema form.
     * { dependencies: {credit_card: {required: ['billing_address']}} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.7
     */
    dependencies?: {[key: string]: string[] | JsonSchema<Config>};

    /**
     * Strict upper bound for numeric values (value must be strictly less than this);
     * ignored for non-numeric values.
     *
     * Draft-07 typing — a `number`. (In Draft-04 this keyword was a `boolean` modifier
     * for `maximum`; that form is not supported here.)
     *
     * @example
     * { exclusiveMaximum: 100 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.3
     */
    exclusiveMaximum?: number;

    /**
     * Strict lower bound for numeric values (value must be strictly greater than
     * this); ignored for non-numeric values.
     *
     * Draft-07 typing — a `number`. (In Draft-04 this keyword was a `boolean` modifier
     * for `minimum`; that form is not supported here.)
     *
     * @example
     * { exclusiveMinimum: 0 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.5
     */
    exclusiveMinimum?: number;

    /**
     * Constrains array items; ignored for non-array values. Two forms:
     *
     * - **Single schema** — every array item must validate against it. `additionalItems`
     *   is ignored in this form.
     * - **Tuple (array of schemas)** — positional validation: item at index `i` must
     *   validate against `items[i]`. Items beyond the tuple are governed by
     *   `additionalItems` (default: any are allowed).
     *
     * @example
     * // Single schema — homogeneous array.
     * { items: {type: JsonSchemaType.String} }
     *
     * @example
     * // Tuple — first item string, second item number.
     * { items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.1
     */
    items?: JsonSchema<Config> | JsonSchema<Config>[];

    /**
     * Inclusive upper bound for numeric values; ignored for non-numeric values.
     *
     * @example
     * { maximum: 100 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.2
     */
    maximum?: number;

    /**
     * Maximum number of items the array may contain; ignored for non-array values.
     *
     * @example
     * { maxItems: 10 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.3
     */
    maxItems?: number;

    /**
     * Longest allowed string length; ignored for non-string values.
     *
     * Length is counted in **UTF-16 code units** (matching `String.prototype.length`
     * in JS), not user-perceived characters. Characters outside the BMP — including
     * many emoji — count as 2.
     *
     * @example
     * { maxLength: 100 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.3.1
     */
    maxLength?: number;

    /**
     * Maximum number of own properties the object may declare; ignored for non-object
     * values.
     *
     * @example
     * { maxProperties: 5 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.1
     */
    maxProperties?: number;

    /**
     * Inclusive lower bound for numeric values; ignored for non-numeric values.
     *
     * @example
     * { minimum: 0 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.4
     */
    minimum?: number;

    /**
     * Minimum number of items the array must contain; ignored for non-array values.
     *
     * @example
     * { minItems: 1 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.4
     */
    minItems?: number;

    /**
     * Shortest allowed string length; ignored for non-string values.
     *
     * Length is counted in **UTF-16 code units** (matching `String.prototype.length`
     * in JS), not user-perceived characters. Characters outside the BMP — including
     * many emoji — count as 2.
     *
     * @example
     * { minLength: 5 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.3.2
     */
    minLength?: number;

    /**
     * Minimum number of own properties the object must declare; ignored for non-object
     * values.
     *
     * @example
     * { minProperties: 1 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.2
     */
    minProperties?: number;

    /**
     * Numeric value must be an exact multiple of this number; ignored for non-numeric
     * values. The divisor must be strictly greater than 0.
     *
     * Supports fractional steppers (e.g. `0.25`). Watch for IEEE-754 representation:
     * `0.1 + 0.2 !== 0.3`. AJV uses an epsilon-tolerant comparison, but constructing
     * the value via repeated addition in JS may still produce an unexpected mismatch.
     *
     * @example
     * { multipleOf: 0.25 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.1
     */
    multipleOf?: number;

    /**
     * ECMA-262 regular expression the string value must match; ignored for non-string
     * values.
     *
     * **No implicit anchors** — the pattern matches if it can be found anywhere in
     * the string. To require a full match, anchor explicitly with `^` and `$`.
     * Common pitfall: `'[0-9]'` means "contains a digit", not "consists of digits".
     *
     * @example
     * // Matches any string that contains at least one digit.
     * { pattern: '[0-9]' }
     *
     * @example
     * // Matches a capitalised word from start to end.
     * { pattern: '^[A-Z][a-z]+$' }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.3.3
     */
    pattern?: string;

    /**
     * Map of regular-expression keys to schemas; ignored for non-object values.
     * Each property whose name matches a key must validate against the corresponding
     * schema.
     *
     * A property name may match **several** patterns at once — in that case it must
     * validate against **all** matching schemas (allOf-like semantics).
     *
     * Interacts with `properties` (an explicit match wins for that name) and
     * `additionalProperties` (a property is "additional" only if it matches no
     * `properties` key **and** no `patternProperties` key).
     *
     * @example
     * { patternProperties: {'^x-': {type: JsonSchemaType.String}} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.5
     */
    patternProperties?: {[key: string]: JsonSchema<Config>};

    /**
     * Map of property name to schema. Each listed property's value must validate
     * against the corresponding schema; ignored for non-object values.
     *
     * Declaring a property here does **not** make it required — pair with `required`.
     * Properties not listed here are governed by `patternProperties` /
     * `additionalProperties`.
     *
     * @example
     * { properties: {name: {type: JsonSchemaType.String}} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.4
     */
    properties?: {[key: string]: JsonSchema<Config>};

    /**
     * Schema each property **name** must satisfy; ignored for non-object values.
     * Object keys are always strings, so this is typed as `JsonSchemaString`.
     *
     * Validates names only — property values are unaffected.
     *
     * @example
     * { propertyNames: {pattern: '^[a-z][a-zA-Z0-9]*$'} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.8
     */
    propertyNames?: JsonSchemaString<Config>;

    /**
     * Names of properties that must be present on the object value; ignored for
     * non-object values.
     *
     * A name may appear in `required` even if it is not declared in `properties` —
     * then the property must be present but has no schema applied.
     *
     * @example
     * {
     *   properties: {name: {type: JsonSchemaType.String}},
     *   required: ['name'],
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.3
     */
    required?: string[];

    /**
     * When `true`, every array item must be unique; ignored for non-array values.
     *
     * Uniqueness is by deep structural equality (so `{a: 1}` and `{a: 1}` are equal).
     * On large arrays this is O(n²) — be mindful when constraining big lists.
     *
     * @example
     * { uniqueItems: true }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.5
     */
    uniqueItems?: boolean;
}

/**
 * Schema for array values (`type: JsonSchemaType.Array`).
 */
export interface JsonSchemaArray<Config extends SchemaRendererConfig = any>
    extends JsonSchemaBase<Config, JsonSchemaArray<Config>, ArrayValue>,
        EntityParameters<EntityType.Array, Config[EntityType.Array]> {
    /**
     * Declares this schema as describing an array value (or `null`, or a union of
     * the two for nullable arrays).
     *
     * @example
     * { type: JsonSchemaType.Array, items: {type: JsonSchemaType.String} }
     *
     * @example
     * // Nullable array.
     * { type: [JsonSchemaType.Array, JsonSchemaType.Null] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.1.1
     */
    type?:
        | JsonSchemaType.Array
        | JsonSchemaType.Null
        | (JsonSchemaType.Array | JsonSchemaType.Null)[];

    /**
     * Schema applied to array items beyond the positional tuple defined by `items`.
     * Only meaningful when `items` is an array (tuple); ignored when `items` is a
     * single schema.
     *
     * - `true` (default if omitted): any additional items are allowed.
     * - `false`: array length must not exceed the tuple defined by `items`.
     * - schema: every additional item must validate against it.
     *
     * @example
     * { items: [{type: JsonSchemaType.String}], additionalItems: false }
     *
     * @example
     * { items: [{type: JsonSchemaType.String}], additionalItems: {type: JsonSchemaType.Number} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.2
     */
    additionalItems?: JsonSchema<Config> | boolean;

    /**
     * Sub-schema that **at least one** array item must satisfy. An empty array
     * always fails `contains`.
     *
     * Draft-07 note: per the spec the value must be a schema; the `boolean` form is
     * a Draft-2019-09 addition. The current `boolean` typing here is more permissive
     * than Draft-07.
     *
     * @example
     * { contains: {type: JsonSchemaType.Number, minimum: 5} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.6
     */
    contains?: JsonSchema<Config> | boolean;

    /**
     * Constrains array items. Two forms:
     *
     * - **Single schema** — every array item must validate against it. `additionalItems`
     *   is ignored in this form.
     * - **Tuple (array of schemas)** — positional validation: item at index `i` must
     *   validate against `items[i]`. Items beyond the tuple are governed by
     *   `additionalItems`.
     *
     * @example
     * { items: {type: JsonSchemaType.String} }
     *
     * @example
     * { items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.1
     */
    items?: JsonSchema<Config> | JsonSchema<Config>[];

    /**
     * Maximum number of items the array may contain.
     *
     * @example
     * { maxItems: 10 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.3
     */
    maxItems?: number;

    /**
     * Minimum number of items the array must contain.
     *
     * @example
     * { minItems: 1 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.4
     */
    minItems?: number;

    /**
     * When `true`, every array item must be unique.
     *
     * Uniqueness is by deep structural equality. On large arrays this is O(n²) —
     * be mindful when constraining big lists.
     *
     * @example
     * { uniqueItems: true }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.4.5
     */
    uniqueItems?: boolean;
}

/**
 * Schema for boolean values (`type: JsonSchemaType.Boolean`).
 */
export interface JsonSchemaBoolean<Config extends SchemaRendererConfig = any>
    extends JsonSchemaBase<Config, JsonSchemaBoolean<Config>, boolean>,
        EntityParameters<EntityType.Boolean, Config[EntityType.Boolean]> {
    /**
     * Declares this schema as describing a boolean value (or `null`, or a union of
     * the two for nullable booleans).
     *
     * @example
     * { type: JsonSchemaType.Boolean, default: false }
     *
     * @example
     * // Nullable boolean.
     * { type: [JsonSchemaType.Boolean, JsonSchemaType.Null] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.1.1
     */
    type?:
        | JsonSchemaType.Boolean
        | JsonSchemaType.Null
        | (JsonSchemaType.Boolean | JsonSchemaType.Null)[];
}

/**
 * Schema for numeric values (`type: JsonSchemaType.Number`).
 */
export interface JsonSchemaNumber<Config extends SchemaRendererConfig = any>
    extends JsonSchemaBase<Config, JsonSchemaNumber<Config>, number>,
        EntityParameters<EntityType.Number, Config[EntityType.Number]> {
    /**
     * Declares this schema as describing a numeric value.
     *
     * - `Number` — any JSON number (integer or decimal).
     * - `Integer` — numbers with no fractional part (equivalent to combining `Number`
     *   with `multipleOf: 1`).
     * - `Null` — allows `null`; combine in an array for nullable numbers.
     *
     * @example
     * { type: JsonSchemaType.Number, minimum: 0, maximum: 100 }
     *
     * @example
     * // Integer-only, nullable.
     * { type: [JsonSchemaType.Integer, JsonSchemaType.Null] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.1.1
     */
    type?:
        | JsonSchemaType.Number
        | JsonSchemaType.Integer
        | JsonSchemaType.Null
        | (JsonSchemaType.Number | JsonSchemaType.Integer | JsonSchemaType.Null)[];

    /**
     * Strict upper bound (value must be strictly less than this).
     *
     * Draft-07 typing — a `number`. (In Draft-04 this keyword was a `boolean` modifier
     * for `maximum`; that form is not supported here.)
     *
     * @example
     * { type: JsonSchemaType.Number, exclusiveMaximum: 100 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.3
     */
    exclusiveMaximum?: number;

    /**
     * Strict lower bound (value must be strictly greater than this).
     *
     * Draft-07 typing — a `number`. (In Draft-04 this keyword was a `boolean` modifier
     * for `minimum`; that form is not supported here.)
     *
     * @example
     * { type: JsonSchemaType.Number, exclusiveMinimum: 0 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.5
     */
    exclusiveMinimum?: number;

    /**
     * Inclusive upper bound.
     *
     * @example
     * { type: JsonSchemaType.Number, maximum: 100 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.2
     */
    maximum?: number;

    /**
     * Inclusive lower bound.
     *
     * @example
     * { type: JsonSchemaType.Number, minimum: 0 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.4
     */
    minimum?: number;

    /**
     * Value must be an exact multiple of this number. The divisor must be strictly
     * greater than 0.
     *
     * Supports fractional steppers (e.g. `0.25`). Watch for IEEE-754 representation:
     * `0.1 + 0.2 !== 0.3`. AJV uses an epsilon-tolerant comparison, but constructing
     * the value via repeated addition in JS may still produce an unexpected mismatch.
     *
     * @example
     * { type: JsonSchemaType.Number, multipleOf: 0.5 }
     *
     * @example
     * { type: JsonSchemaType.Number, multipleOf: 10 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.2.1
     */
    multipleOf?: number;
}

/**
 * Schema for object values (`type: JsonSchemaType.Object`).
 */
export interface JsonSchemaObject<Config extends SchemaRendererConfig = any>
    extends JsonSchemaBase<Config, JsonSchemaObject<Config>, ObjectValue>,
        EntityParameters<EntityType.Object, Config[EntityType.Object]> {
    /**
     * Declares this schema as describing an object value (or `null`, or a union of
     * the two for nullable objects).
     *
     * @example
     * { type: JsonSchemaType.Object, properties: {name: {type: JsonSchemaType.String}} }
     *
     * @example
     * // Nullable object.
     * { type: [JsonSchemaType.Object, JsonSchemaType.Null] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.1.1
     */
    type?:
        | JsonSchemaType.Object
        | JsonSchemaType.Null
        | (JsonSchemaType.Object | JsonSchemaType.Null)[];

    /**
     * Schema applied to properties not listed in `properties` and not matched by any
     * `patternProperties` key.
     *
     * - `true` (default if omitted): any extra properties are allowed.
     * - `false`: extra properties cause validation to fail.
     * - schema: every extra property's value must validate against it.
     *
     * A property is "additional" only if it matches **neither** `properties` nor
     * `patternProperties`.
     *
     * @example
     * {
     *   properties: {name: {type: JsonSchemaType.String}},
     *   additionalProperties: false,
     * }
     *
     * @example
     * {
     *   properties: {name: {type: JsonSchemaType.String}},
     *   additionalProperties: {type: JsonSchemaType.Number},
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.6
     */
    additionalProperties?: JsonSchema<Config> | boolean;

    /**
     * Property dependencies. Each key triggers a constraint only when that property
     * is present in the value.
     *
     * Two forms per entry:
     * - `string[]` — the listed property names must also be present.
     * - schema (an object schema) — the whole object must additionally validate
     *   against the given schema.
     *
     * Split into `dependentRequired` and `dependentSchemas` in Draft-2019-09 — the
     * project targets Draft-07, so the combined form is used here.
     *
     * @example
     * { dependencies: {credit_card: ['billing_address']} }
     *
     * @example
     * { dependencies: {credit_card: {required: ['billing_address']}} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.7
     */
    dependencies?: {[key: string]: string[] | JsonSchemaObject<Config>};

    /**
     * Maximum number of own properties the object may declare.
     *
     * @example
     * { type: JsonSchemaType.Object, maxProperties: 5 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.1
     */
    maxProperties?: number;

    /**
     * Minimum number of own properties the object must declare.
     *
     * @example
     * { type: JsonSchemaType.Object, minProperties: 1 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.2
     */
    minProperties?: number;

    /**
     * Map of regular-expression keys to schemas. Each property whose name matches a
     * key must validate against the corresponding schema.
     *
     * A property name may match several patterns at once — in that case it must
     * validate against **all** matching schemas (allOf-like semantics).
     *
     * Interacts with `properties` (an explicit match wins for that name) and
     * `additionalProperties` (a property is "additional" only if it matches no
     * `properties` key **and** no `patternProperties` key).
     *
     * @example
     * { patternProperties: {'^x-': {type: JsonSchemaType.String}} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.5
     */
    patternProperties?: {[key: string]: JsonSchema<Config>};

    /**
     * Map of property name to schema. Each listed property's value must validate
     * against the corresponding schema.
     *
     * Declaring a property here does **not** make it required — pair with `required`.
     * Properties not listed here are governed by `patternProperties` /
     * `additionalProperties`.
     *
     * @example
     * {
     *   properties: {
     *     name: {type: JsonSchemaType.String},
     *     age: {type: JsonSchemaType.Number},
     *   },
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.4
     */
    properties?: {[key: string]: JsonSchema<Config>};

    /**
     * Schema each property **name** must satisfy. Object keys are always strings, so
     * in practice this should be a string schema constraining length or pattern.
     *
     * Validates names only — property values are unaffected.
     *
     * @example
     * { propertyNames: {type: JsonSchemaType.String, pattern: '^[a-z][a-zA-Z0-9]*$'} }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.8
     */
    propertyNames?: JsonSchema<Config>;

    /**
     * Names of properties that must be present on the object value.
     *
     * A name may appear in `required` even if it is not declared in `properties` —
     * then the property must be present but has no schema applied.
     *
     * @example
     * {
     *   properties: {name: {type: JsonSchemaType.String}},
     *   required: ['name'],
     * }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.5.3
     */
    required?: string[];
}

/**
 * Schema for string values (`type: JsonSchemaType.String`).
 */
export interface JsonSchemaString<Config extends SchemaRendererConfig = any>
    extends JsonSchemaBase<Config, JsonSchemaString<Config>, string>,
        EntityParameters<EntityType.String, Config[EntityType.String]> {
    /**
     * Declares this schema as describing a string value (or `null`, or a union of
     * the two for nullable strings).
     *
     * @example
     * { type: JsonSchemaType.String, minLength: 1 }
     *
     * @example
     * // Nullable string.
     * { type: [JsonSchemaType.String, JsonSchemaType.Null] }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.1.1
     */
    type?:
        | JsonSchemaType.String
        | JsonSchemaType.Null
        | (JsonSchemaType.String | JsonSchemaType.Null)[];

    /**
     * Longest allowed string length.
     *
     * Length is counted in **UTF-16 code units** (matching `String.prototype.length`
     * in JS), not user-perceived characters. Characters outside the BMP — including
     * many emoji — count as 2.
     *
     * @example
     * { type: JsonSchemaType.String, maxLength: 100 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.3.1
     */
    maxLength?: number;

    /**
     * Shortest allowed string length.
     *
     * Length is counted in **UTF-16 code units** (matching `String.prototype.length`
     * in JS), not user-perceived characters. Characters outside the BMP — including
     * many emoji — count as 2.
     *
     * @example
     * { type: JsonSchemaType.String, minLength: 5 }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.3.2
     */
    minLength?: number;

    /**
     * ECMA-262 regular expression the string value must match.
     *
     * **No implicit anchors** — the pattern matches if it can be found anywhere in
     * the string. To require a full match, anchor explicitly with `^` and `$`.
     * Common pitfall: `'[0-9]'` means "contains a digit", not "consists of digits".
     *
     * @example
     * // Contains at least one digit.
     * { type: JsonSchemaType.String, pattern: '[0-9]' }
     *
     * @example
     * // Capitalised word from start to end.
     * { type: JsonSchemaType.String, pattern: '^[A-Z][a-z]+$' }
     *
     * @see https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6.3.3
     */
    pattern?: string;
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
export type JsonSchema<Config extends SchemaRendererConfig = any> =
    | JsonSchemaAny<Config>
    | JsonSchemaArray<Config>
    | JsonSchemaBoolean<Config>
    | JsonSchemaNumber<Config>
    | JsonSchemaObject<Config>
    | JsonSchemaString<Config>;
