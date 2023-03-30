import React from 'react';

import _ from 'lodash';

import {ObjectIndependentView, ViewController} from '../../../../core';

const TEXT_LINK_PROPERTY_NAME = 'text';

export const TextLinkView: ObjectIndependentView = ({value, spec, name}) => {
    const specProperties = spec.properties;

    const preparedSpec = React.useMemo(
        () =>
            specProperties && specProperties[TEXT_LINK_PROPERTY_NAME]
                ? {
                      ...specProperties[TEXT_LINK_PROPERTY_NAME],
                      viewSpec: {
                          ...specProperties[TEXT_LINK_PROPERTY_NAME]?.viewSpec,
                          link: value?.link,
                      },
                  }
                : undefined,
        [specProperties, value?.link],
    );

    return preparedSpec ? (
        <ViewController spec={preparedSpec} name={`${name}.${TEXT_LINK_PROPERTY_NAME}`} />
    ) : null;
};
