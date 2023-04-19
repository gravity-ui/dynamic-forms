import React from 'react';

import _ from 'lodash';

import {ObjectIndependentView, Spec, ViewController} from '../../../../core';

const OBJECT_VALUE_PROPERTY_NAME = 'value';

export const ObjectValueInputView: ObjectIndependentView = ({spec, name, Layout, ...restProps}) => {
    const specProperties = {...spec.properties};

    if (!specProperties[OBJECT_VALUE_PROPERTY_NAME]) {
        return null;
    }

    const content = (
        <ViewController
            spec={_.omit(specProperties[OBJECT_VALUE_PROPERTY_NAME], ['viewSpec.layout']) as Spec}
            name={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`}
        />
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
