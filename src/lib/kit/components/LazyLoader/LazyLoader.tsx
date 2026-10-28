import React from 'react';

import isUndefined from 'lodash/isUndefined';

export type LazyLoaderProps = {
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    initialFallback?: React.JSX.Element;
};

export const LazyLoader = ({
    component,
    initialFallback = <React.Fragment></React.Fragment>,
}: LazyLoaderProps): React.JSX.Element => {
    const fallback = React.useRef(() => initialFallback);
    const Component = component;

    const updateFallback = async (): Promise<void> => {
        const result = await component._result;

        if (!isUndefined(result)) {
            fallback.current = (result as any).default;
        }
    };

    React.useEffect(() => {
        updateFallback();
    }, [component]);

    return (
        <React.Suspense fallback={<fallback.current />}>
            <Component />
        </React.Suspense>
    );
};
