import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {NumberSpec} from '../lib';
import {RangeInputPickerNumber, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Number/RangeInputPicker',
    component: RangeInputPickerNumber,
};

const baseSpec: NumberSpec = {
    type: SpecTypes.Number,
    minimum: 0,
    maximum: 100,
    viewSpec: {
        type: 'range_input_picker',
        layout: 'row',
        layoutTitle: 'Volume',
        placeholder: 'volume',
    },
};

const excludeOptions = ['viewSpec.type'];

const template = (spec: NumberSpec = baseSpec) => {
    const Template: StoryFn<typeof RangeInputPickerNumber> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const RangeInputPicker = template();
