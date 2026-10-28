import React from 'react';

import isUndefined from 'lodash/isUndefined';
import omit from 'lodash/omit';

import {getParentName} from '../';

export const useSearchStore = () => {
    const [store, setStore] = React.useState<Record<string, boolean>>({});

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

            if (isUndefined(selfFlag)) {
                return false;
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
            setStore((store) => omit(store, name));
        },
        isHiddenField,
    };
};
