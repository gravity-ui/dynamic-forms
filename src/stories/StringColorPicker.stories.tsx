import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {StringSpec} from '../lib';
import {ColorPicker as ColorPickerBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/ColorPicker',
    component: ColorPickerBase,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    defaultValue: '#5282ff',
    viewSpec: {
        type: 'color_picker',
        layout: 'row',
        layoutTitle: 'Color Picker',
        colorPicker: {
            size: 'm',
        },
    },
};

const excludeOptions = [
    'maximum',
    'minimum',
    'format',
    'enum',
    'description',
    'viewSpec.type',
    'viewSpec.sizeParams',
    'viewSpec.monacoParams',
    'viewSpec.textContentParams',
    'viewSpec.fileInput',
    'viewSpec.dateInput',
    'viewSpec.placeholder',
    'viewSpec.layoutOpen',
    'viewSpec.selectParams',
    'viewSpec.radioGroupParams',
    'viewSpec.generateRandomValueButton',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof ColorPickerBase> = (__, {viewMode}) => (
        <InputPreview
            spec={spec}
            value={spec.defaultValue}
            excludeOptions={excludeOptions}
            viewMode={viewMode}
        />
    );

    return Template;
};

export const ColorPicker = template();
