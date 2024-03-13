import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import {ObjectIndependentView, ViewController} from '../../../../core';
import {OBJECT_VALUE_PROPERTY_NAME} from '../../../constants/common';

export const ObjectValueInputView: ObjectIndependentView = ({spec, name, Layout, ...restProps}) => {
    const childSpec = React.useMemo(() => {
        if (spec.properties?.[OBJECT_VALUE_PROPERTY_NAME]) {
            const childSpec = cloneDeep(spec.properties[OBJECT_VALUE_PROPERTY_NAME]);

            childSpec.viewSpec.layout = '';

            return childSpec;
        }

        return undefined;
    }, [spec.properties]);

    if (!childSpec) {
        return null;
    }

    const content = (
        <ViewController
            spec={childSpec}
            name={`${name ? name + '.' : ''}${OBJECT_VALUE_PROPERTY_NAME}`}
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
