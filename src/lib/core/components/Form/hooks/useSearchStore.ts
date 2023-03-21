import React from 'react';

import _ from 'lodash';

import {SearchStore, searchParentName} from '../';

export const useSearchStore = (name: string) => {
    const [store, setStore] = React.useState<SearchStore>({[name]: true});

    const isHidden = React.useCallback(
        (name: string) => {
            const storeSearch = store[name];

            if (!storeSearch && storeSearch !== undefined) {
                return false;
            }

            let parentName = searchParentName(name);

            if (parentName) {
                for (let i = 0; i < name.split('.').length - 1; i++) {
                    if (!store[parentName]) {
                        return false;
                    }

                    parentName = searchParentName(parentName);

                    if (!parentName) {
                        break;
                    }
                }
            }

            for (const key of Object.keys(store)) {
                if (key.includes(name + '.')) {
                    if (!store[key]) {
                        return false;
                    }
                }
            }

            return true;
        },
        [store],
    );

    return {
        store,
        onChangeStore: (name: string, search: boolean) =>
            setStore((store) => ({...store, [name]: search})),
        onDeleteField: (name: string) => {
            setStore((store) => _.omit(store, name));
        },
        isHidden,
    };
};
