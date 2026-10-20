/** @deprecated Use the SchemaRenderer API. */
export type AnyObject = Record<string, any>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayValue = FormValue[];
/** @deprecated Use the SchemaRenderer API. */
export interface ObjectValue extends Record<string, FormValue> {}
/** @deprecated Use the SchemaRenderer API. */
export type FormValue = number | boolean | string | ArrayValue | ObjectValue | null | undefined;
