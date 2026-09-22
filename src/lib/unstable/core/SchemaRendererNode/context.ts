import React from 'react';

import type {SchemaRendererMode} from '../constants';
import type {SchemaRendererSettings} from '../useSchemaRenderer';

export interface SchemaRendererNodeContextValue {
    headName: string;
    mode?: SchemaRendererMode;
    name: string;
    schemaPath: string;
    settings?: SchemaRendererSettings;
}

export const SchemaRendererNodeContext = React.createContext<SchemaRendererNodeContextValue | null>(
    null,
);

export const useSchemaRendererNodeContext = () => React.useContext(SchemaRendererNodeContext);
