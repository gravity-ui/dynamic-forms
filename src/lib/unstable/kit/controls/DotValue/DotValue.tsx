import React from 'react';

import get from 'lodash/get';
import isString from 'lodash/isString';

import {type Control, Entity, type JsonSchemaObject} from '../../../core';

export interface DotValueProps {}

const Component: Control<JsonSchemaObject, DotValueProps> = ({input, schema}) => {
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
        <Entity
            name={`${name ? name + '.' : ''}${childKey}`}
            schema={schema.properties?.[childKey]}
        />
    );
};

export const DotValue = React.memo(Component);
