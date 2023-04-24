import React from 'react';

import _ from 'lodash';

import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
    ObjectSpec,
    Spec,
    ValidateError,
} from '../../../../core';
import {useComponents} from '../../../../core/components/Form/hooks';

const SECRET_PROPERTY_NAME = 'raw';

export const Secret: ObjectIndependentInput = (props) => {
    const {spec, name, input, Layout} = props;

    const specProperties = {...spec.properties} as Record<string, Spec>;

    const childSpec = React.useMemo(() => {
        if (specProperties[SECRET_PROPERTY_NAME]) {
            const childSpec = _.cloneDeep(specProperties[SECRET_PROPERTY_NAME]);

            childSpec.viewSpec.layout = '';

            return childSpec;
        }

        return undefined;
    }, [specProperties]);

    const layoutSpec: ObjectSpec = React.useMemo(
        () => ({
            ...spec,
            viewSpec: {
                ...spec.viewSpec,
                layout:
                    spec.viewSpec.layout || specProperties[SECRET_PROPERTY_NAME]?.viewSpec.layout,
                layoutTitle:
                    spec.viewSpec.layoutTitle ||
                    specProperties[SECRET_PROPERTY_NAME]?.viewSpec.layoutTitle,
                layoutDescription:
                    spec.viewSpec.layoutDescription ||
                    specProperties[SECRET_PROPERTY_NAME]?.viewSpec.layoutDescription,
            },
        }),
        [spec, specProperties],
    );

    const {Layout: LayoutChild} = useComponents(layoutSpec);

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

    const LayoutContent = Layout || (LayoutChild as typeof Layout);

    if (LayoutContent) {
        return (
            <LayoutContent {...props} spec={layoutSpec} input={input}>
                {content}
            </LayoutContent>
        );
    }

    return <React.Fragment>{content}</React.Fragment>;
};
