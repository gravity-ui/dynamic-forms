import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
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
                    set({...currentValue}, childName.split(`${name}.`).join(''), childValue),
                childErrors,
            ),
        [input.onChange, input.name],
    );

    const childSpec = React.useMemo(() => {
        if (
            spec.properties?.[TEXT_LINK_PROPERTY_NAME] &&
            isStringSpec(spec.properties[TEXT_LINK_PROPERTY_NAME])
        ) {
            const childSpec = cloneDeep(spec.properties[TEXT_LINK_PROPERTY_NAME]);

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
            value={input.value?.[TEXT_LINK_PROPERTY_NAME]}
            spec={childSpec}
            name={`${name}.${TEXT_LINK_PROPERTY_NAME}`}
            key={`${name}.${TEXT_LINK_PROPERTY_NAME}`}
            parentOnChange={parentOnChange}
            parentOnUnmount={input.parentOnUnmount}
        />
    );

    if (Layout) {
        return <Layout {...props}>{content}</Layout>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
