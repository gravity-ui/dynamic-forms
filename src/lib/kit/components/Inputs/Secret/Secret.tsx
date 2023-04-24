import React from 'react';

import _ from 'lodash';

import {Controller, FieldValue, ObjectIndependentInput, ValidateError} from '../../../../core';

const SECRET_PROPERTY_NAME = 'raw';

export const Secret: ObjectIndependentInput = (props) => {
    const {spec, name, input, Layout} = props;

    const childSpec = React.useMemo(() => {
        if (spec.properties?.[SECRET_PROPERTY_NAME]) {
            const childSpec = _.cloneDeep(spec.properties?.[SECRET_PROPERTY_NAME]);

            childSpec.viewSpec.layout = '';

            return childSpec;
        }

        return undefined;
    }, [spec.properties]);

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

    const parentOnUnmount = React.useCallback(
        (childName: string) => input.onChange((currentValue) => currentValue, {[childName]: false}),
        [input.onChange],
    );

    if (!childSpec) {
        return null;
    }

    const content = (
        <Controller
            initialValue={input.value?.[SECRET_PROPERTY_NAME]}
            spec={childSpec}
            name={`${name}.${SECRET_PROPERTY_NAME}`}
            parentOnChange={parentOnChange}
            parentOnUnmount={parentOnUnmount}
            key={`${name}.${SECRET_PROPERTY_NAME}`}
        />
    );

    if (Layout) {
        return <Layout {...props}>{content}</Layout>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
