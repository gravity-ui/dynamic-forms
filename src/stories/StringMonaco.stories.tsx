import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {StringSpec} from '../lib';
import {MonacoInput, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/MonacoEditor',
    component: MonacoInput,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {
        type: 'monaco_input',
        layout: 'group2',
        layoutTitle: 'Editor',
        layoutOpen: true,
        monacoParams: {language: 'json', fontSize: 11},
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
    'viewSpec.placeholder',
    'viewSpec.textContentParams',
    'viewSpec.fileInput',
    'viewSpec.dateInput',
    'viewSpec.copy',
    'viewSpec.selectParams',
    'viewSpec.generateRandomValueButton',
    'viewSpec.inputProps',
    'viewSpec.radioGroupParams',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof MonacoInput> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const MonacoEditor = template();
