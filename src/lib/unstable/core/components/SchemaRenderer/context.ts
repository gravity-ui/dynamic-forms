import React from 'react';

import type {SchemaRendererContextType} from '../../types';

export const SchemaRendererContext = React.createContext<SchemaRendererContextType>(
    null as unknown as SchemaRendererContextType,
);
