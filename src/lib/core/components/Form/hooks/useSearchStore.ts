import React from 'react';

import _ from 'lodash';

import {SearchStore} from './useSearchContext';

const searchParentName = (name: string) => {
    const index = name.lastIndexOf('.');
    if (index !== -1) {
        return name.substring(0, index);
    }
    return undefined;
};

export const useSearchStore = (name: string) => {
    const [store, setStore] = React.useState<SearchStore>({[name]: true});

    const isShowFieldByName = React.useCallback(
        (name: string) => {
            const storeSearch = store[name];
            if (storeSearch) {
                return storeSearch;
            }

            let parentName = searchParentName(name);

            if (parentName) {
                for (let i = 0; i < name.split('.').length - 1; i++) {
                    if (store[parentName]) {
                        return true;
                    }

                    parentName = searchParentName(parentName);

                    if (!parentName) {
                        break;
                    }
                }
            }

            for (const key of Object.keys(store)) {
                if (key.includes(name)) {
                    if (store[key]) {
                        return true;
                    }
                }
            }

            return false;
        },
        [name, store],
    );

    return {
        store,
        onChangeStore: (name: string, search: boolean) =>
            setStore((store) => ({...store, [name]: search})),
        onDeleteField: (name: string) => {
            setStore((store) => _.omit(store, name));
        },
        isShowFieldByName,
    };
};
