import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Object/FewOfNested',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Object,
        title: 'Few of',
        description: 'Few of nested field',
        properties: {
            foo: {
                type: JsonSchemaType.Object,
                title: 'Foo',
                properties: {
                    name: {
                        type: JsonSchemaType.String,
                        title: 'Name',
                        minLength: 3,
                        nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
                    },
                },
                nodeParameters: {type: NodeType.Object, entity: 'base', layout: 'section'},
            },
            bar: {
                type: JsonSchemaType.Number,
                title: 'Bar',
                minimum: 0,
                nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'row'},
            },
        },
        nodeParameters: {
            type: NodeType.Object,
            entity: 'few_of_nested',
            entityProps: {
                toggler: {
                    title: 'Fields',
                    items: {enum: ['foo', 'bar']},
                    nodeParameters: {type: NodeType.Array, entity: 'select', layout: 'row'},
                },
                withIndent: true,
            },
            layout,
        },
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={{foo: {name: 'Ada'}, bar: 10}}
            incorrectValue={{foo: {name: 'A'}, bar: -1}}
            title={`FewOfNested entity + ${layoutName}`}
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
