export type ArrayValue = FieldValue[];
export interface ObjectValue extends Record<string, FieldValue> {}
export type FieldValue = number | boolean | string | ArrayValue | ObjectValue;
