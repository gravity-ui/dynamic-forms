import React from 'react';

import _ from 'lodash';

import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
    Spec,
    ValidateError,
} from '../../../../core';

const OBJECT_VALUE_PROPERTY_NAME = 'value';

export const ObjectValueInput: ObjectIndependentInput = (props) => {
    const {spec, input, name, Layout} = props;

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    _.set(
                        {...currentValue},
                        childName.split(`${name}.`).join(''),
                        _.isNil(childValue) || _.isUndefined(childValue) || childValue === ''
                            ? null
                            : childValue,
                    ),
                childErrors,
            ),
        [input.onChange, input.name],
    );

    const parentOnUnmount = React.useCallback(
        (childName: string) => input.onChange((currentValue) => currentValue, {[childName]: false}),
        [input.onChange],
    );

    const specValue = spec.properties ? spec.properties[OBJECT_VALUE_PROPERTY_NAME] : undefined;

    if (!specValue) {
        return null;
    }

    const content = (
        <Controller
            initialValue={
                _.isNil(input.value?.[OBJECT_VALUE_PROPERTY_NAME])
                    ? undefined
                    : input.value?.[OBJECT_VALUE_PROPERTY_NAME]
            }
            spec={_.omit(specValue, ['viewSpec.layout']) as Spec}
            name={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`}
            key={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`}
            parentOnChange={parentOnChange}
            parentOnUnmount={parentOnUnmount}
        />
    );

    if (Layout) {
        return <Layout {...props}>{content}</Layout>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
