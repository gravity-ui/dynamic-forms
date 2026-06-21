import React from 'react';

import {Entity} from '../Entity';
import {type UseSchemaRendererParams, useSchemaRenderer} from '../useSchemaRenderer';

export interface SchemaRendererProps extends Omit<UseSchemaRendererParams, 'connectValidate'> {}

const SchemaRendererComponent: React.FC<SchemaRendererProps> = (props) => {
    const {schema} = useSchemaRenderer(props);

    return schema ? <Entity name={props.name} schema={schema} /> : null;
};

export const SchemaRenderer = React.memo(SchemaRendererComponent);
