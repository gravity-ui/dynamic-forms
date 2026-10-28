import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/String/Alert',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.String,
        title: 'Alert',
        description: 'Alert field',
        minLength: 5,
        nodeParameters: {
            type: NodeType.String,
            entity: 'alert',
            entityProps: {
                iconName: 'CircleExclamationFill',
                iconProps: {size: 18, color: 'positive'},
                message: 'Lorem ipsum dolor sit amet',
                title: 'Alert title',
                theme: 'info',
            },
            layout,
        },
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue="Alert value"
            incorrectValue="Hi"
            title={`Alert entity + ${layoutName}`}
            schema={schema}
        />
    );

    return Template;
};

export const WithNoLayout = createStory(undefined, 'No layout');
export const WithAccordeonLayout = createStory('accordeon', 'Accordeon layout');
export const WithCardLayout = createStory('card', 'Card layout');
export const WithCellLayout = createStory('cell', 'Cell layout');
export const WithColumnLayout = createStory('column', 'Column layout');
export const WithRowLayout = createStory('row', 'Row layout');
export const WithSectionLayout = createStory('section', 'Section layout');
export const WithTransparentLayout = createStory('transparent', 'Transparent layout');
