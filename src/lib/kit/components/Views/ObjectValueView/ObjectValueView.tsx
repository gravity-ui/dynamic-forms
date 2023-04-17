import React from 'react';

import _ from 'lodash';

import {ObjectIndependentView, ViewController} from '../../../../core';

const OBJECT_VALUE_PROPERTY_NAME = 'value';

export const ObjectValueView: ObjectIndependentView = ({spec, name}) => {
    const specProperties = {...spec.properties};

    if (!specProperties[OBJECT_VALUE_PROPERTY_NAME]) {
        return null;
    }

    return (
        <ViewController
            spec={specProperties[OBJECT_VALUE_PROPERTY_NAME]}
            name={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`}
        />
    );
};
