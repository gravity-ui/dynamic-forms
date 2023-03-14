import React from 'react';

import {useCreateContext} from './';

export const useDynamicFormsCtx = () => {
    const DynamicFormsCtx = useCreateContext();
    const context = React.useContext(DynamicFormsCtx);

    return context;
};
