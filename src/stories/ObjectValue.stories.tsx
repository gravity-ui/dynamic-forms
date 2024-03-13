import React from 'react';

import {StoryFn} from '@storybook/react';

import {ObjectSpec, ObjectValueInput as ObjectValueInputBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/ObjectValue',
    component: ObjectValueInputBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        value: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
            },
        },
    },
    viewSpec: {
        type: 'object_value',
        layout: 'row',
        layoutTitle: 'Object value',
    },
};

const excludeOptions = [
    'description',
    'validator',
    'viewSpec.type',
    'viewSpec.order',
    'viewSpec.layoutOpen',
    'viewSpec.disabled',
    'viewSpec.oneOfParams',
    'viewSpec.placeholder',
    'viewSpec.delimiter',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof ObjectValueInputBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const ObjectValue = template();
