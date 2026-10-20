import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {StringSpec} from '../../lib/deprecated';
import {ColorPicker as ColorPickerBase, SpecTypes} from '../../lib/deprecated';

import {InputPreview} from './components';

export default {
    title: 'Deprecated/String/ColorPicker',
    component: ColorPickerBase,
    parameters: {
        docs: {
            description: {
                component:
                    'Color picker input for `StringSpec`, using the stable `ColorPicker` ' +
                    'from `@gravity-ui/uikit`.',
            },
        },
    },
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    defaultValue: '#5282ff',
    viewSpec: {
        type: 'color_picker',
        layout: 'row',
        layoutTitle: 'Color Picker',
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
