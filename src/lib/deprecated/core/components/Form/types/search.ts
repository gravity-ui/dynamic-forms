import type {Spec} from '../../../types';

import type {FieldValue} from './value';

/** @deprecated Use the SchemaRenderer API. */
export interface SearchContext {
    setField: (name: string, search: boolean) => void;
    removeField: (name: string) => void;
    isHiddenField: (name: string) => boolean;
    searchFunction: (spec: Spec, value: FieldValue, name: string) => boolean;
}
