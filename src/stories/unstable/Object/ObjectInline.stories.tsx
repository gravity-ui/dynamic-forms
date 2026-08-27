import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Object/ObjectInline',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Object,
        title: 'Inline',
        description: 'Object inline field',
        properties: {
            foo: {
                type: JsonSchemaType.String,
                title: 'Foo',
                minLength: 3,
                nodeParameters: {type: NodeType.String, entity: 'base', layout: 'transparent'},
            },
            bar: {
                type: JsonSchemaType.Number,
                title: 'Bar',
                nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'transparent'},
            },
            rab: {
                type: JsonSchemaType.Boolean,
                title: 'Rab',
                nodeParameters: {type: NodeType.Boolean, entity: 'base', layout: 'transparent'},
            },
        },
        nodeParameters: {
            type: NodeType.Object,
            entity: 'inline',
            entityProps: {delimiter: ':'},
            layout,
        },
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={{foo: 'Ada', bar: 1, rab: true}}
            incorrectValue={{foo: 'A', bar: 1, rab: true}}
            title={`ObjectInline entity + ${layoutName}`}
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
