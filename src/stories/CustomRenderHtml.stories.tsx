import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {ArrayBase, ObjectSpec} from '../lib';
import {SpecTypes} from '../lib';

import {Editor as EditorBase} from './components/Editor/Editor';

export default {
    title: 'Other/CustomRenderHtml',
    component: EditorBase,
};

const spec: ObjectSpec = {
    type: SpecTypes.Object,
    required: true,
    properties: {
        accordeon: {
            type: SpecTypes.Object,
            required: true,
            properties: {
                row: {
                    type: SpecTypes.Boolean,
                    viewSpec: {
                        type: 'base',
                        layout: 'row',
                        layoutTitle: 'Row description md',
                        layoutDescription: '### Description is made in markdown format',
                    },
                },
                rowVerbose: {
                    type: SpecTypes.String,
                    viewSpec: {
                        type: 'base',
                        layout: 'row_verbose',
                        layoutTitle: 'Row Verbose',
                        placeholder: 'placeholder text',
                        layoutDescription: '`Row Verbose description md`',
                    },
                },
                alert: {
                    type: SpecTypes.String,
                    viewSpec: {
                        type: 'text_content',
                        textContentParams: {
                            text: '### Introduction to Web Technologies\n Markdown is **incredibly useful** for quick documentation. It allows you to: \n\n _Format text easily_\n\n -Create lists-\n\n -Add links <div class="important-note"> <h3>Important HTML Section</h3> <p>This section uses HTML for more complex formatting needs that Markdown doesnt support natively.</p> </div>',
                            themeAlert: 'info',
                            icon: '',
                        },
                    },
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'accordeon',
                layoutTitle: 'Accordeon',
                layoutOpen: true,
                layoutDescription: '### Description is made in markdown format',
            },
        },
        card: {
            type: SpecTypes.Object,
            required: true,
            properties: {
                column: {
                    type: SpecTypes.String,
                    viewSpec: {
                        type: 'base',
                        layout: 'column',
                        layoutTitle: 'column',
                        placeholder: 'placeholder text',
                        layoutDescription:
                            '[Link html Dynamic Forms](https://github.com/gravity-ui/dynamic-forms)',
                    },
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'card_section',
                layoutTitle: 'Card',
                layoutOpen: true,
                layoutDescription: '### Description is made in markdown format',
            },
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'transparent',
        layoutTitle: '',
        layoutOpen: true,
        layoutDescription: '',
    },
};

const template = () => {
    const Template: StoryFn<typeof ArrayBase> = (__, {viewMode}) => (
        <EditorBase spec={spec} viewMode={viewMode} withCustomRenderHtml={true} />
    );

    return Template;
};

export const CustomRenderHtml = template();
