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

    const childSpec = React.useMemo(() => {
        if (spec.properties?.[OBJECT_VALUE_PROPERTY_NAME]) {
            const childSpec = _.cloneDeep(spec.properties[OBJECT_VALUE_PROPERTY_NAME]);

            childSpec.viewSpec.layout = 'transparent';

            return childSpec;
        }

        return undefined;
    }, [spec.properties]);

    if (!childSpec) {
        return null;
    }

    const content = (
        <Controller
            initialValue={input.value?.[OBJECT_VALUE_PROPERTY_NAME]}
            spec={childSpec}
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
