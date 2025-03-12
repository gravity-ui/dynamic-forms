import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import type {FieldValue, ObjectIndependentInput, ValidateError} from '../../../../core';
import {Controller} from '../../../../core';
import {OBJECT_VALUE_PROPERTY_NAME} from '../../../constants/common';

export const ObjectValueInput: ObjectIndependentInput = (props) => {
    const {spec, input, name, Layout} = props;

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    set({...currentValue}, childName.split(`${name}.`).join(''), childValue),
                childErrors,
            ),
        [input.onChange, input.name],
    );

    const childSpec = React.useMemo(() => {
        if (spec.properties?.[OBJECT_VALUE_PROPERTY_NAME]) {
            const childSpec = cloneDeep(spec.properties[OBJECT_VALUE_PROPERTY_NAME]);

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
            value={input.value?.[OBJECT_VALUE_PROPERTY_NAME]}
            spec={childSpec}
            name={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`}
            key={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`}
            parentOnChange={parentOnChange}
            parentOnUnmount={input.parentOnUnmount}
        />
    );

    if (Layout) {
        return <Layout {...props}>{content}</Layout>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
