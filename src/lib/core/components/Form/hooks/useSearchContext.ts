import React from 'react';

import _ from 'lodash';

import {Spec} from '../../../types';
import {FieldValue} from '../types';

export type SearchStore = {
    [key: string]: boolean;
};

export interface SearchContext {
    store?: SearchStore;
    onChangeStore: (name: string, search: boolean) => void;
    searchFunction?: (spec: Spec, value: FieldValue, name: string) => boolean;
    onDeleteField: (name: string) => void;
    isShowFieldByName: (name: string) => boolean;
}

const createContext = _.once(() => React.createContext({} as unknown as SearchContext));

export const useCreateSearchContext = () => createContext();

export const useSearchContext = () => {
    const SearchContext = useCreateSearchContext();
    const context = React.useContext(SearchContext);

    return context;
};
