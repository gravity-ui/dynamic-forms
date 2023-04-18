import React from 'react';

import _ from 'lodash';

import {Controller, FieldValue, ObjectIndependentInput, ValidateError} from '../../../../core';

const OBJECT_VALUE_PROPERTY_NAME = 'value';

export const ObjectValueInput: ObjectIndependentInput = ({spec, input, name}) => {
    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    _.set({...currentValue}, childName.split(`${name}.`).join(''), childValue),
                childErrors,
            ),
        [input.onChange, input.name],
    );

    const parentOnUnmount = React.useCallback(
        (childName: string) => input.onChange((currentValue) => currentValue, {[childName]: false}),
        [input.onChange],
    );

    const specProperties = {...spec.properties};

    if (!specProperties[OBJECT_VALUE_PROPERTY_NAME]) {
        return null;
    }

    return (
        <Controller
            initialValue={input.value?.[OBJECT_VALUE_PROPERTY_NAME]}
            spec={specProperties[OBJECT_VALUE_PROPERTY_NAME]}
            name={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`}
            key={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`}
            parentOnChange={parentOnChange}
            parentOnUnmount={parentOnUnmount}
        />
    );
};
