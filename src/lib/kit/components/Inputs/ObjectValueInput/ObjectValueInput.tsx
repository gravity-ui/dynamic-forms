import React from 'react';

import _ from 'lodash';

import {Controller, FieldValue, ObjectIndependentInput, ValidateError} from '../../../../core';

const OBJECT_VALUE_PROPERTY_NAME = 'value';

export const ObjectValueInput: ObjectIndependentInput = (props) => {
    const {spec, input, name, Layout} = props;

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

    const valueSpec = React.useMemo(
        () =>
            spec.properties && spec.properties[OBJECT_VALUE_PROPERTY_NAME]
                ? {
                      ...spec.properties[OBJECT_VALUE_PROPERTY_NAME],
                      viewSpec: {
                          ...spec.properties[OBJECT_VALUE_PROPERTY_NAME].viewSpec,
                          layout: undefined,
                      },
                  }
                : undefined,
        [spec.properties],
    );

    if (!valueSpec) {
        return null;
    }

    const content = (
        <Controller
            initialValue={input.value?.[OBJECT_VALUE_PROPERTY_NAME]}
            spec={valueSpec}
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
