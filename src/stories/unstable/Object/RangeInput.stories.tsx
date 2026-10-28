import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Object/RangeInput',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Object,
        title: 'Range',
        description: 'Range input field',
        properties: {
            from: {
                type: JsonSchemaType.Number,
                title: 'From',
                minimum: 0,
                nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'transparent'},
            },
            to: {
                type: JsonSchemaType.Number,
                title: 'To',
                maximum: 100,
                nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'transparent'},
            },
        },
        nodeParameters: {type: NodeType.Object, entity: 'range_input', layout},
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={{from: 10, to: 20}}
            incorrectValue={{from: 80, to: 10}}
            title={`RangeInput entity + ${layoutName}`}
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
