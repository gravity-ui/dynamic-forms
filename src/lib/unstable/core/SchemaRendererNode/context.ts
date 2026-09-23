import React from 'react';

import type {FieldRenderProps} from 'react-final-form';

import type {SchemaRendererMode} from '../constants';
import type {FieldValue, JsonSchema} from '../types';
import type {SchemaRendererSettings} from '../useSchemaRenderer';

export interface SchemaRendererNodeContextValue extends FieldRenderProps<FieldValue> {
    headName: string;
    mode: SchemaRendererMode;
    name: string;
    schema: JsonSchema;
    schemaPath: string;
    settings?: SchemaRendererSettings;
}

export const SchemaRendererNodeContext = React.createContext<SchemaRendererNodeContextValue>(
    {} as unknown as SchemaRendererNodeContextValue,
);

export const useSchemaRendererNodeContext = () => React.useContext(SchemaRendererNodeContext);
