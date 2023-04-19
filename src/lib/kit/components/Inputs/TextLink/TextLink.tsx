import React from 'react';

import _ from 'lodash';

import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
    Spec,
    ValidateError,
    isStringSpec,
} from '../../../../core';

const TEXT_LINK_PROPERTY_NAME = 'text';

export const TextLink: ObjectIndependentInput = (props) => {
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

    const specProperties = {...spec.properties};

    if (
        !specProperties[TEXT_LINK_PROPERTY_NAME] ||
        !isStringSpec(specProperties[TEXT_LINK_PROPERTY_NAME])
    ) {
        return null;
    }

    const content = (
        <Controller
            initialValue={input.value?.[TEXT_LINK_PROPERTY_NAME]}
            spec={_.omit(specProperties[TEXT_LINK_PROPERTY_NAME], ['viewSpec.layout']) as Spec}
            name={`${name}.${TEXT_LINK_PROPERTY_NAME}`}
            key={`${name}.${TEXT_LINK_PROPERTY_NAME}`}
            parentOnChange={parentOnChange}
            parentOnUnmount={parentOnUnmount}
        />
    );

    if (Layout) {
        return <Layout {...props}>{content}</Layout>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
