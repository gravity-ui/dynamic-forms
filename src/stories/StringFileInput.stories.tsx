import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {StringSpec} from '../lib';
import {FileInput as FileInputBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/FileInput',
    component: FileInputBase,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {
        type: 'file_input',
        layout: 'row',
        layoutTitle: 'File Input',
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
    'viewSpec.dateInput',
    'viewSpec.placeholder',
    'viewSpec.layoutOpen',
    'viewSpec.selectParams',
    'viewSpec.generateRandomValueButton',
    'viewSpec.inputProps',
    'viewSpec.radioGroupParams',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof FileInputBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const FileInput = template();
