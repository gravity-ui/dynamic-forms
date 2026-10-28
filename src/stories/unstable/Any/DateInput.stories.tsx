import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Any/DateInput',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        title: 'Date',
        description: 'Date field',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        nodeParameters: {type: NodeType.Any, entity: 'date', layout},
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue="2020-01-01"
            incorrectValue="not-a-date"
            title={`DateInput entity + ${layoutName}`}
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
