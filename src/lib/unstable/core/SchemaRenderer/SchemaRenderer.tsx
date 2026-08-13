import React from 'react';

import {SchemaNode} from '../SchemaNode';
import {type UseSchemaRendererParams, useSchemaRenderer} from '../useSchemaRenderer';

export interface SchemaRendererProps extends Omit<UseSchemaRendererParams, 'connectValidate'> {}

const SchemaRendererComponent: React.FC<SchemaRendererProps> = (props) => {
    useSchemaRenderer(props);

    return <SchemaNode headName={props.name} name={props.name} schemaPath="#" />;
};

export const SchemaRenderer = React.memo(SchemaRendererComponent);
