export type AnyObject = Record<string, any>;

export type ArrayValue = FormValue[];
export interface ObjectValue extends Record<string, FormValue> {}
export type FormValue =
    | number
    | boolean
    | string
    | Date
    | ArrayValue
    | ObjectValue
    | null
    | undefined;
