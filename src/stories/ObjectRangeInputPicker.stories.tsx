import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {ObjectSpec} from '../lib';
import {RangeInputPicker as RangeInputPickerBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/RangeInputPicker',
    component: RangeInputPickerBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        from: {
            type: SpecTypes.Number,
            minimum: 0,
            maximum: 100,
            viewSpec: {
                type: 'base',
                placeholder: 'from',
            },
        },
        to: {
            type: SpecTypes.Number,
            minimum: 0,
            maximum: 100,
            viewSpec: {
                type: 'base',
                placeholder: 'to',
            },
        },
    },
    viewSpec: {
        type: 'range_input_picker',
        layout: 'row',
        layoutTitle: 'Price',
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
    'viewSpec.inputProps',
    'viewSpec.layoutProps',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof RangeInputPickerBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const RangeInputPicker = template();
