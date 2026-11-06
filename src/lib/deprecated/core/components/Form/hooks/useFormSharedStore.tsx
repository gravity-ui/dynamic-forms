import React from 'react';

export const useFormSharedStore = (shared?: Record<string, any>) => {
    const firstRender = React.useRef(true);
    const [store, setStore] = React.useState(shared || {});

    const onChangeShared = React.useCallback(
        (name: string, value: any) => setStore((s) => ({...s, [name]: value})),
        [setStore],
    );

    React.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
        } else if (shared) {
            setStore({
                ...store,
                ...shared,
            });
        }
    }, [shared]);

    return {store, onChangeShared};
};
