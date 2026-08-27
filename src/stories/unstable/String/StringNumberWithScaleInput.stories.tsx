import React from 'react';

import type {StoryFn} from '@storybook/react';

import {type JsonSchema, JsonSchemaType, NodeType} from '../../../lib/unstable/core';
import {EntityPreview} from '../../components/EntityPreview';

export default {
    title: 'Unstable/String/StringNumberWithScaleInput',
    component: EntityPreview,
    parameters: {layout: 'fullscreen'},
};

const createStory = (layout: string | undefined, layoutName: string): StoryFn => {
    const schema: JsonSchema = {
        type: JsonSchemaType.String,
        title: 'Distance',
        description: 'String number with scale field',
        stringNumber: {
            type: JsonSchemaType.Number,
            maximum: '3000',
            minimum: '500',
            multipleOf: '100',
        },
        nodeParameters: {
            type: NodeType.String,
            entity: 'string_number_with_scale',
            entityProps: {
                defaultType: 'm',
                scale: {
                    km: {title: 'km', factor: '1000'},
                    m: {title: 'm', factor: '1'},
                    cm: {title: 'cm', factor: '0.01'},
                },
                viewType: 'm',
            },
            layout,
        },
    };
    const Template: StoryFn = () => (
        <EntityPreview
            correctValue="1000"
            incorrectValue="100"
            title={`StringNumberWithScaleInput entity + ${layoutName}`}
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
