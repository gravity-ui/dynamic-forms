import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/String/Monaco',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.String,
        title: 'JSON',
        description: 'Monaco field',
        minLength: 10,
        nodeParameters: {
            type: NodeType.String,
            entity: 'monaco',
            entityProps: {language: 'json', height: 140},
            overviewEntity: 'monaco',
            overviewEntityProps: {language: 'json', height: 140},
            layout,
        },
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={'{\n  "foo": "bar"\n}'}
            incorrectValue="{}"
            title={`Monaco entity + ${layoutName}`}
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
