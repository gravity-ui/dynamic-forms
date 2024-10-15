import React from 'react';

export const useFormSharedStore = () => {
    const [store, setStore] = React.useState({});

    const onChangeShared = React.useCallback(
        (name: string, value: any) => setStore((s) => ({...s, [name]: value})),
        [setStore],
    );

    return {store, onChangeShared};
};
