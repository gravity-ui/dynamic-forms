import React from 'react';

import {ObjectIndependentView, ViewController} from '../../../../core';

const OBJECT_VALUE_PROPERTY_NAME = 'value';

export const ObjectValueInputView: ObjectIndependentView = ({spec, name, Layout, ...restProps}) => {
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
        <ViewController spec={valueSpec} name={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`} />
    );

    if (Layout) {
        return (
            <Layout spec={spec} name={name} {...restProps}>
                {content}
            </Layout>
        );
    }

    return <React.Fragment>{content}</React.Fragment>;
};
