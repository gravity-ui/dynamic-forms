import React from 'react';

import {useCreateContext} from '.';

/** @deprecated Use the SchemaRenderer API. */
export const useDynamicFormsCtx = () => {
    const DynamicFormsCtx = useCreateContext();
    const context = React.useContext(DynamicFormsCtx);

    return context;
};
