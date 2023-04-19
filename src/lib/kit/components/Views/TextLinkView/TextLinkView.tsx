import React from 'react';

import _ from 'lodash';

import {ObjectIndependentView, ViewController} from '../../../../core';

const TEXT_LINK_PROPERTY_NAME = 'text';

export const TextLinkView: ObjectIndependentView = ({value, spec, name, Layout, ...restProps}) => {
    const specProperties = spec.properties;

    const preparedSpec = React.useMemo(
        () =>
            specProperties && specProperties[TEXT_LINK_PROPERTY_NAME]
                ? {
                      ...specProperties[TEXT_LINK_PROPERTY_NAME],
                      viewSpec: {
                          ...specProperties[TEXT_LINK_PROPERTY_NAME]?.viewSpec,
                          link: value?.link,
                          layout: undefined,
                      },
                  }
                : undefined,
        [specProperties, value?.link],
    );

    const content = preparedSpec ? (
        <ViewController spec={preparedSpec} name={`${name}.${TEXT_LINK_PROPERTY_NAME}`} />
    ) : null;

    if (Layout && content) {
        return (
            <Layout spec={spec} name={name} value={value} {...restProps}>
                {content}
            </Layout>
        );
    }

    return <React.Fragment>{content}</React.Fragment>;
};
