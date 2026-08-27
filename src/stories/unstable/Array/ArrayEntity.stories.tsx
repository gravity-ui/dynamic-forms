import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Array/ArrayEntity',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Array,
        title: 'Items',
        description: 'Array base field',
        minItems: 2,
        items: {
            type: JsonSchemaType.String,
            title: 'Item',
            minLength: 3,
            nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
        },
        nodeParameters: {type: NodeType.Array, entity: 'base', layout},
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={['one', 'two']}
            incorrectValue={['a']}
            title={`ArrayEntity entity + ${layoutName}`}
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
