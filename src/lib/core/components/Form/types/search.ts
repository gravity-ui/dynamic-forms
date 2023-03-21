import {Spec} from '../../../types';

import {FieldValue} from './value';

export type SearchStore = {
    [key: string]: boolean;
};

export interface SearchContext {
    store?: SearchStore;
    onChangeStore: (name: string, search: boolean) => void;
    searchFunction?: (spec: Spec, value: FieldValue, name: string) => boolean;
    onDeleteField: (name: string) => void;
    isHidden: (name: string) => boolean;
}
