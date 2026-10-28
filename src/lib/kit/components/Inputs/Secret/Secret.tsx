import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import type {FieldValue, ObjectIndependentInput, ValidateError} from '../../../../core';
import {Controller} from '../../../../core';

const SECRET_PROPERTY_NAME = 'raw';

export const Secret: ObjectIndependentInput = (props) => {
    const {spec, name, input, Layout} = props;

    const childSpec = React.useMemo(() => {
        if (spec.properties?.[SECRET_PROPERTY_NAME]) {
            const childSpec = cloneDeep(spec.properties?.[SECRET_PROPERTY_NAME]);

            childSpec.viewSpec.layout = 'transparent';

            return childSpec;
        }

        return undefined;
    }, [spec.properties]);

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    set({...currentValue}, childName.split(`${input.name}.`).join(''), childValue),
                childErrors,
            ),
        [input.onChange, input.name],
    );

    if (!childSpec) {
        return null;
    }

    const content = (
        <Controller
            value={input.value?.[SECRET_PROPERTY_NAME]}
            spec={childSpec}
            name={`${name}.${SECRET_PROPERTY_NAME}`}
            parentOnChange={parentOnChange}
            parentOnUnmount={input.parentOnUnmount}
            key={`${name}.${SECRET_PROPERTY_NAME}`}
        />
    );

    if (Layout) {
        return <Layout {...props}>{content}</Layout>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
