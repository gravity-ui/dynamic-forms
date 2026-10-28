import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Array/ArrayTable',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Array,
        title: 'People',
        description: 'Array table field',
        minItems: 1,
        items: {
            type: JsonSchemaType.Object,
            title: 'Person',
            properties: {
                name: {
                    type: JsonSchemaType.String,
                    title: 'Name',
                    minLength: 2,
                    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'cell'},
                },
                surname: {
                    type: JsonSchemaType.String,
                    title: 'Surname',
                    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'cell'},
                },
                age: {
                    type: JsonSchemaType.Number,
                    title: 'Age',
                    nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'cell'},
                },
            },
            nodeParameters: {type: NodeType.Object, entity: 'base', layout: 'accordeon'},
        },
        nodeParameters: {type: NodeType.Array, entity: 'table', layout},
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={[{name: 'John', surname: 'Doe', age: 30}]}
            incorrectValue={[{name: 'J', surname: 'Doe', age: 30}]}
            title={`ArrayTable entity + ${layoutName}`}
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
