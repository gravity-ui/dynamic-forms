import type React from 'react';

import type {FieldValue, ValidateError} from './';

export interface FieldRenderProps<Value extends FieldValue> {
    input: {
        name: string;
        value: Value;
        onBlur: (event?: React.FocusEvent<HTMLElement>) => void;
        onChange: (
            value: Value | ((currentValue: Value) => Value),
            childErrors?: Record<string, ValidateError>,
        ) => void;
        onFocus: (event?: React.FocusEvent<HTMLElement>) => void;
        onDrop: () => void;
        parentOnUnmount: (childName: string) => void;
    };
    arrayInput: {
        name: string;
        value: Value;
        onItemAdd: (value?: FieldValue) => void;
        onItemRemove: (name: string) => void;
        onDrop: () => void;
    };
    meta: {
        active: boolean;
        dirty: boolean;
        error: ValidateError;
        invalid: boolean;
        modified: boolean;
        pristine: boolean;
        touched: boolean;
        valid: boolean;
        visited: boolean;
        submitFailed: boolean;
        childErrors: Record<string, ValidateError>;
    };
}
