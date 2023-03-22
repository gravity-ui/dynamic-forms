import React from 'react';

import _ from 'lodash';

import {getParentName} from '../';

export const useSearchStore = (name: string) => {
    const [store, setStore] = React.useState({[name]: false});

    const isHiddenField = React.useCallback(
        (name: string) => {
            const selfFlag = store[name];

            if (selfFlag === false) {
                return false;
            }

            let parentName = getParentName(name);

            while (parentName) {
                if (store[parentName] === false) {
                    return false;
                }

                parentName = getParentName(parentName);
            }

            for (const key of Object.keys(store)) {
                if (key.includes(name + '.') && !store[key]) {
                    return false;
                }
            }

            return true;
        },
        [store],
    );

    return {
        store,
        setField: (name: string, search: boolean) =>
            setStore((store) => ({...store, [name]: search})),
        removeField: (name: string) => {
            setStore((store) => _.omit(store, name));
        },
        isHiddenField,
    };
};
