import React from 'react';

import get from 'lodash/get';
import isString from 'lodash/isString';

import {type Control, Entity, type JsonSchemaObject} from '../../../core';

export interface DotValueProps {}

const Component: Control<JsonSchemaObject, DotValueProps> = ({input, schema}) => {
    const childKey = 'value';

    React.useLayoutEffect(() => {
        if (input.value) {
            const childValue = get(input.value, childKey);

            if (
                childValue === null ||
                childValue === undefined ||
                childValue === '' ||
                (isString(childValue) && childValue.endsWith('_UNSPECIFIED'))
            ) {
                input.onChange(undefined);
            }
        }
    }, [input.value]);

    return (
        <Entity
            name={`${input.name ? input.name + '.' : ''}${childKey}`}
            schema={schema.properties?.[childKey]}
        />
    );
};

export const DotValue = React.memo(Component);
