import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/Number/NumberWithScaleInput',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Number,
        title: 'Distance',
        description: 'Number with scale field',
        minimum: 500,
        maximum: 3000,
        multipleOf: 100,
        nodeParameters: {
            type: NodeType.Number,
            entity: 'number_with_scale',
            entityProps: {
                defaultType: 'm',
                scale: {
                    km: {title: 'km', factor: 1000},
                    m: {title: 'm', factor: 1},
                    cm: {title: 'cm', factor: 0.01},
                },
                viewType: 'm',
            },
            layout,
        },
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue={1000}
            incorrectValue={100}
            title={`NumberWithScaleInput entity + ${layoutName}`}
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
