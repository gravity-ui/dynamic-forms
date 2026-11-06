import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {StringSpec} from '../../lib/deprecated';
import {SpecTypes, Text} from '../../lib/deprecated';

import {InputPreview} from './components';

export default {
    title: 'Deprecated/String/Base',
    component: Text,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name', placeholder: 'placeholder text'},
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
    'viewSpec.selectParams',
    'viewSpec.radioGroupParams',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof Text> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Base = template();
