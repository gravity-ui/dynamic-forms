import React from 'react';

import get from 'lodash/get';
import isString from 'lodash/isString';

import {
    type JsonSchemaObject,
    type NodeEntity,
    SchemaRendererMode,
    SchemaRendererNode,
} from '../../../core';
import {EmptyEntityValue, EntityContainer} from '../../components';

export interface DotValueProps {}

export const DotValue: NodeEntity<JsonSchemaObject, DotValueProps> = ({
    headName,
    input,
    mode,
    schemaPath,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    const childKey = 'value';
    const overviewFlag = mode === SchemaRendererMode.Overview;

    React.useLayoutEffect(() => {
        if (value && !overviewFlag) {
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

    if (overviewFlag && Object.keys(value || {}).length === 0) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer stretch="by-child" fill="by-child">
            <SchemaRendererNode
                headName={headName}
                name={`${name ? name + '.' : ''}${childKey}`}
                schemaPath={`${schemaPath}/properties/${childKey}`}
            />
        </EntityContainer>
    );
};
