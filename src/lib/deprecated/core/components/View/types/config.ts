import type {FormValue, Spec} from '../../../types';

import type {
    ArrayViewConfig,
    BooleanViewConfig,
    NumberViewConfig,
    ObjectViewConfig,
    StringViewConfig,
    ViewLayoutsMap,
    ViewsMap,
} from '.';

/** @deprecated Use the SchemaRenderer API. */
export interface ViewTypeConfig<Value extends FormValue, SpecType extends Spec> {
    views: ViewsMap<Value, SpecType>;
    layouts: ViewLayoutsMap<Value, SpecType>;
}

/** @deprecated Use the SchemaRenderer API. */
export interface DynamicViewConfig {
    array: ArrayViewConfig;
    boolean: BooleanViewConfig;
    number: NumberViewConfig;
    object: ObjectViewConfig;
    string: StringViewConfig;
}
