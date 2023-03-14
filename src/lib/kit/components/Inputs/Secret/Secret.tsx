import React from 'react';

import _ from 'lodash';

import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
    Spec,
    ValidateError,
} from '../../../../core';

const SECRET_PROPERTY_NAME = 'raw';

export const Secret: ObjectIndependentInput = ({spec, name, input}) => {
    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    _.set(
                        {...currentValue},
                        childName.split(`${input.name}.`).join(''),
                        childValue,
                    ),
                childErrors,
            ),
        [input.onChange, input.name],
    );

    if (!_.isObjectLike(spec.properties)) {
        return null;
    }

    const specProperties = {...spec.properties} as Record<string, Spec>;

    if (!specProperties[SECRET_PROPERTY_NAME]) {
        return null;
    }

    return (
        <Controller
            initialValue={input.value?.[SECRET_PROPERTY_NAME]}
            spec={specProperties[SECRET_PROPERTY_NAME]}
            name={`${name}.${SECRET_PROPERTY_NAME}`}
            parentOnChange={parentOnChange}
            key={`${name}.${SECRET_PROPERTY_NAME}`}
        />
    );
};
