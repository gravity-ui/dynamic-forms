import {FormValue, Spec} from '../../../types';

import {
    ArrayViewConfig,
    BooleanViewConfig,
    NumberViewConfig,
    ObjectViewConfig,
    StringViewConfig,
    ViewLayoutsMap,
    ViewsMap,
} from './';

export interface ViewTypeConfig<Value extends FormValue, SpecType extends Spec> {
    views: ViewsMap<Value, SpecType>;
    layouts: ViewLayoutsMap<Value, SpecType>;
}

export interface DynamicViewConfig {
    array: ArrayViewConfig;
    boolean: BooleanViewConfig;
    number: NumberViewConfig;
    object: ObjectViewConfig;
    string: StringViewConfig;
}
