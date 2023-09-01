import React from 'react';

import {StoryFn} from '@storybook/react';

import {FileInput as FileInputBase, SpecTypes, StringSpec} from '../lib';

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
    'viewSpec.placeholder',
    'viewSpec.layoutOpen',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof FileInputBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const FileInput = template();
