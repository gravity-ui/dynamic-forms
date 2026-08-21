import React from 'react';

import get from 'lodash/get';
import isString from 'lodash/isString';

import {type JsonSchemaObject, type NodeEntity, SchemaRendererNode} from '../../../core';
import {EntityContainer} from '../../components';

export interface DotValueProps {}

const DotValueComponent: NodeEntity<JsonSchemaObject, DotValueProps> = ({
    input,
    headName,
    schemaPath,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    const childKey = 'value';

    React.useLayoutEffect(() => {
        if (value) {
            const childValue = get(value, childKey);

            if (
                childValue === null ||
                childValue === undefined ||
                childValue === '' ||
                (isString(childValue) && childValue.endsWith('_UNSPECIFIED'))
            ) {
                onFocus();
                onChange(undefined);
                onBlur();
            }
        }
    }, [value]);

    return (
        <EntityContainer stretch="by-child">
            <SchemaRendererNode
                headName={headName}
                name={`${name ? name + '.' : ''}${childKey}`}
                schemaPath={`${schemaPath}/properties/${childKey}`}
            />
        </EntityContainer>
    );
};

export const DotValue = React.memo(DotValueComponent);
