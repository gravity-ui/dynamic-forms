import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Object/RangeSliderInput',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Object,
        title: 'Range',
        description: 'Range slider field',
        properties: {
            from: {type: JsonSchemaType.Number, minimum: 0},
            to: {type: JsonSchemaType.Number, maximum: 100},
        },
        nodeParameters: {type: NodeType.Object, entity: 'range_slider', layout},
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={{from: 20, to: 80}}
            incorrectValue={{from: 90, to: 10}}
            title={`RangeSliderInput entity + ${layoutName}`}
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
