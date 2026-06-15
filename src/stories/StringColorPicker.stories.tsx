import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {StringSpec} from '../lib';
import {ColorPicker as ColorPickerBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/ColorPicker',
    component: ColorPickerBase,
    parameters: {
        docs: {
            description: {
                component:
                    'Color picker input for `StringSpec`. ' +
                    '\n\n' +
                    '> **Note:** this input wraps `unstable_ColorPicker` from ' +
                    '`@gravity-ui/uikit/unstable`. The underlying uikit component is **unstable** — ' +
                    'its API, available props and visual presentation may change between uikit ' +
                    'releases without following semver. Pin the `@gravity-ui/uikit` version if you ' +
                    'need a stable look-and-feel.' +
                    '\n\n' +
                    'See the [uikit ColorPicker docs](https://preview.gravity-ui.com/uikit/?path=/docs/lab-colorpicker--docs).',
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
