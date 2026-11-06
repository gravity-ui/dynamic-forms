import React from 'react';

import type {DynamicFieldMirror, WonderMirror} from '../types';

export const useDynamicFieldMirror = (params: DynamicFieldMirror, __mirror?: WonderMirror) => {
    if (__mirror?.field) {
        __mirror.field.useStore = params.useStore;
        __mirror.field.useIntegrationFF = params.useIntegrationFF;
        __mirror.field.useSearchStore = params.useSearchStore;
    }

    React.useEffect(() => {
        return () => {
            if (__mirror?.field) {
                delete __mirror.field.useStore;
                delete __mirror.field.useIntegrationFF;
                delete __mirror.field.useSearchStore;
            }
        };
    }, []);
};
