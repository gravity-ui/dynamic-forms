import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Object/ObjectEntity',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Object,
        title: 'Person',
        description: 'Object base field',
        required: ['name'],
        properties: {
            name: {
                type: JsonSchemaType.String,
                title: 'Name',
                minLength: 2,
                nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
            },
            age: {
                type: JsonSchemaType.Number,
                title: 'Age',
                minimum: 0,
                nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'row'},
            },
            license: {
                type: JsonSchemaType.Boolean,
                title: 'License',
                nodeParameters: {type: NodeType.Boolean, entity: 'base', layout: 'row'},
            },
        },
        nodeParameters: {type: NodeType.Object, entity: 'base', layout},
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={{name: 'Ada', age: 36, license: true}}
            incorrectValue={{name: 'A', age: -1, license: true}}
            title={`ObjectEntity entity + ${layoutName}`}
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
