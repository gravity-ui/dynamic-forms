import React from 'react';

import {StoryFn} from '@storybook/react';

import {ArrayBase, ObjectSpec, SpecTypes} from '../lib';

import {Editor as EditorBase} from './components/Editor/Editor';

export default {
    title: 'Other/CustomRenderHtml',
    component: EditorBase,
};

const spec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        alert: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'text_content',
                textContentParams: {
                    text: '# Markdown\n a lightweight markup language designed to indicate formatting in plain text while preserving its human readability as much as possible, and suitable for machine conversion into advanced publishing languages ​​(HTML, Rich Text, and others). <br><h1>HTML</h1><br> a standardized hypertext markup language for viewing web pages in a browser.',
                    themeAlert: 'info',
                },
            },
        },
        row: {
            type: SpecTypes.Boolean,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Age',
                layoutDescription: '### Description is made in markdown format',
            },
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Candidate',
        layoutOpen: true,
        layoutDescription: '### Description is made in markdown format',
    },
    required: true,
};

const template = () => {
    const Template: StoryFn<typeof ArrayBase> = (__, {viewMode}) => (
        <EditorBase spec={spec} viewMode={viewMode} withCustomRenderHtml={true} />
    );

    return Template;
};

export const CustomRenderHtml = template();
