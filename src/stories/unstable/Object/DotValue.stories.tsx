import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Object/DotValue',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Object,
        title: 'Value',
        description: 'Dot value field',
        properties: {
            value: {
                type: JsonSchemaType.String,
                title: 'Value',
                minLength: 3,
                nodeParameters: {type: NodeType.String, entity: 'base', layout: 'transparent'},
            },
        },
        nodeParameters: {type: NodeType.Object, entity: 'dot_value', layout},
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={{value: 'test'}}
            incorrectValue={{value: 'ab'}}
            title={`DotValue entity + ${layoutName}`}
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
