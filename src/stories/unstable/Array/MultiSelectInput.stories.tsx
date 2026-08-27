import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Array/MultiSelectInput',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Array,
        title: 'Statuses',
        description: 'Multi select field',
        minItems: 2,
        items: {
            type: JsonSchemaType.String,
            enum: ['draft', 'published', 'archived'],
        },
        nodeParameters: {
            type: NodeType.Array,
            entity: 'select',
            entityProps: {
                enumDescriptions: {draft: 'Draft', published: 'Published', archived: 'Archived'},
            },
            layout,
        },
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={['draft', 'published']}
            incorrectValue={['draft']}
            title={`MultiSelectInput entity + ${layoutName}`}
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
