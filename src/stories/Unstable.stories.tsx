import React from 'react';

import {Button, SegmentedRadioGroup} from '@gravity-ui/uikit';
import type {StoryFn} from '@storybook/react';
import {noop} from 'lodash';
import {Form} from 'react-final-form';
import MonacoEditor from 'react-monaco-editor';

import {ObjectBase} from '../lib';
import {SchemaRenderer, createNodeParametersDefiner} from '../lib/unstable/core';
import {JsonSchemaType, NodeType, SchemaRendererMode} from '../lib/unstable/core/constants';
import type {JsonSchemaObject} from '../lib/unstable/core/types';
import {config, untypedConfig} from '../lib/unstable/kit/constants/config';

export default {
    title: 'Unstable/Base',
    component: ObjectBase,
};

const defineNodeParameters = createNodeParametersDefiner(untypedConfig);

const schema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        textarea: {
            type: JsonSchemaType.String,
            title: 'textarea',
            description: 'textarea description',
            minLength: 10,
            nodeParameters: defineNodeParameters({
                entity: 'textarea',
                type: NodeType.String,
                entityProps: {
                    rows: 10,
                },
                layout: 'row',
                layoutProps: {
                    descriptionType: 'tooltip',
                    copy: true,
                },
            }),
        },
        monaco: {
            default: JSON.stringify(
                {
                    extends: '@gravity-ui/tsconfig/tsconfig.json',
                    include: ['src/**/*.ts', 'src/**/*.tsx'],
                    exclude: ['src/stories'],
                    compilerOptions: {
                        outDir: 'build/esm',
                        module: 'esnext',
                        jsx: 'react',
                        resolveJsonModule: true,
                        baseUrl: '.',
                        declaration: true,
                        allowJs: true,
                        importHelpers: true,
                        paths: {
                            '@gravity-ui/dynamic-forms/unstable': ['./src/unstable.ts'],
                            '@gravity-ui/uikit/unstable': [
                                'node_modules/@gravity-ui/uikit/build/esm/unstable',
                            ],
                        },
                    },
                },
                null,
                2,
            ),
            type: JsonSchemaType.String,
            title: 'monaco',
            nodeParameters: {
                type: NodeType.String,
                entity: 'monaco',
                layout: 'row',
                entityProps: {language: 'json'},
                overviewEntity: 'monaco',
                overviewEntityProps: {language: 'json'},
            },
        },
        string_number_with_scale: {
            default: '1000',
            type: JsonSchemaType.String,
            title: 'string_number_with_scale',
            stringNumber: {
                type: JsonSchemaType.Number,
                maximum: '3000',
                minimum: '500',
                multipleOf: '100',
            },
            nodeParameters: {
                type: NodeType.String,
                entity: 'string_number_with_scale',
                layout: 'row',
                entityProps: {
                    scale: {
                        km: {title: 'km', factor: '1000'},
                        m: {title: 'm', factor: '1'},
                        cm: {title: 'cm', factor: '0.01'},
                    },
                    defaultType: 'm',
                    viewType: 'm',
                },
            },
        },
        number_with_scale: {
            default: 1000,
            type: JsonSchemaType.Number,
            maximum: 3000,
            minimum: 500,
            multipleOf: 100,
            title: 'number_with_scale',
            nodeParameters: defineNodeParameters({
                type: NodeType.Number,
                entity: 'number_with_scale',
                layout: 'row',
                entityProps: {
                    scale: {
                        km: {title: 'km', factor: 1000},
                        m: {title: 'm', factor: 1},
                        cm: {title: 'cm', factor: 0.01},
                    },
                    defaultType: 'm',
                    viewType: 'm',
                },
            }),
        },
        range_input: {
            type: JsonSchemaType.Object,
            title: 'range_input',
            description: 'range input description',
            properties: {
                from: {
                    type: JsonSchemaType.Number,
                    title: 'from',
                    nodeParameters: {
                        type: NodeType.Number,
                        entity: 'base',
                        layout: 'transparent',
                    },
                },
                to: {
                    type: JsonSchemaType.Number,
                    title: 'to',
                    nodeParameters: defineNodeParameters({
                        type: NodeType.Number,
                        entity: 'base',
                        layout: 'transparent',
                    }),
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                entity: 'range_input',
                layout: 'row',
            },
        },
        object_inline: {
            type: JsonSchemaType.Object,
            title: 'object_inline',
            description: 'object inline description',
            properties: {
                foo: {
                    type: JsonSchemaType.String,
                    title: 'foo',
                    nodeParameters: {
                        type: NodeType.String,
                        entity: 'select',
                        layout: 'transparent',
                    },
                },
                bar: {
                    type: JsonSchemaType.Number,
                    title: 'bar',
                    nodeParameters: {
                        type: NodeType.Number,
                        entity: 'base',
                        layout: 'transparent',
                    },
                },
                rab: {
                    type: JsonSchemaType.Boolean,
                    title: 'rab',
                    nodeParameters: {
                        type: NodeType.Boolean,
                        entity: 'base',
                        layout: 'transparent',
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                entity: 'inline',
                layout: 'row',
                entityProps: {
                    delimiter: ':',
                },
            },
        },
        one_of_nested: {
            type: JsonSchemaType.Object,
            title: 'one_of_nested',
            description: 'one of nested description',
            properties: {
                foo: {
                    type: JsonSchemaType.Object,
                    title: 'foo',
                    properties: {
                        foo: {
                            $ref: '#/properties/textarea',
                            type: JsonSchemaType.String,
                            title: 'foo',
                            description: 'one_of_nested',
                            nodeParameters: {
                                type: NodeType.String,
                                entity: 'base',
                                layout: 'row',
                            },
                            allOf: [
                                {
                                    minLength: 10,
                                },
                            ],
                        },
                        bar: {
                            type: JsonSchemaType.Number,
                            title: 'bar',
                            multipleOf: 5,
                            nodeParameters: {
                                type: NodeType.Number,
                                entity: 'base',
                                layout: 'row',
                            },
                        },
                        rab: {
                            type: JsonSchemaType.Boolean,
                            title: 'rab',
                            nodeParameters: {
                                type: NodeType.Boolean,
                                entity: 'base',
                                layout: 'row',
                            },
                        },
                    },
                    nodeParameters: {
                        type: NodeType.Object,
                        entity: 'base',
                        layout: 'section',
                    },
                },
                bar: {
                    type: JsonSchemaType.Number,
                    title: 'bar',
                    nodeParameters: {
                        type: NodeType.Number,
                        entity: 'base',
                        layout: 'row',
                    },
                },
                rab: {
                    type: JsonSchemaType.Boolean,
                    title: 'rab',
                    nodeParameters: {
                        type: NodeType.Boolean,
                        entity: 'base',
                        layout: 'row',
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                entity: 'one_of_nested',
                layout: 'transparent',
                entityProps: {
                    booleanToKey: {
                        true: 'foo',
                        false: 'bar',
                    },
                    toggler: {
                        title: 'one of toggler',
                        nodeParameters: {
                            type: NodeType.Boolean,
                            entity: 'switch',
                            layout: 'row',
                        },
                    },
                    withIndent: true,
                },
            },
        },
        few_of_nested: {
            type: JsonSchemaType.Object,
            title: 'few_of_nested',
            description: 'few of nested description',
            properties: {
                foo: {
                    type: JsonSchemaType.Object,
                    title: 'foo',
                    properties: {
                        foo: {
                            $ref: '#/properties/one_of_nested/properties/foo/properties/foo',
                            type: JsonSchemaType.String,
                            title: 'foo',
                            nodeParameters: {
                                type: NodeType.String,
                                entity: 'base',
                                layout: 'row',
                            },
                        },
                        bar: {
                            type: JsonSchemaType.Number,
                            title: 'bar',
                            nodeParameters: {
                                type: NodeType.Number,
                                entity: 'base',
                                layout: 'row',
                            },
                        },
                        rab: {
                            type: JsonSchemaType.Boolean,
                            title: 'rab',
                            nodeParameters: {
                                type: NodeType.Boolean,
                                entity: 'base',
                                layout: 'row',
                            },
                        },
                    },
                    nodeParameters: {
                        type: NodeType.Object,
                        entity: 'base',
                        layout: 'section',
                    },
                },
                bar: {
                    type: JsonSchemaType.Number,
                    title: 'bar',
                    nodeParameters: {
                        type: NodeType.Number,
                        entity: 'base',
                        layout: 'row',
                    },
                },
                rab: {
                    type: JsonSchemaType.Boolean,
                    title: 'rab',
                    nodeParameters: {
                        type: NodeType.Boolean,
                        entity: 'base',
                        layout: 'row',
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                entity: 'few_of_nested',
                layout: 'transparent',
                entityProps: {
                    toggler: {
                        title: 'few of toggler',
                        items: {
                            enum: ['foo', 'bar', 'rab'],
                        },
                        nodeParameters: {
                            type: NodeType.Array,
                            entity: 'select',
                            layout: 'row',
                        },
                    },
                    withIndent: true,
                },
            },
        },
        array: {
            type: JsonSchemaType.Array,
            title: 'array',
            description: 'array description',
            items: {
                type: JsonSchemaType.String,
                title: 'item',
                description: 'item description',
                nodeParameters: {
                    type: NodeType.String,
                    entity: 'base',
                    layout: 'row',
                },
            },
            nodeParameters: {
                type: NodeType.Array,
                entity: 'base',
                layout: 'card',
            },
        },
        tuple: {
            type: JsonSchemaType.Array,
            title: 'tuple',
            description: 'tuple description',
            items: [
                {
                    type: JsonSchemaType.String,
                    title: 'item',
                    description: 'string item description',
                    nodeParameters: {
                        type: NodeType.String,
                        entity: 'base',
                        layout: 'row',
                    },
                },
                {
                    type: JsonSchemaType.Number,
                    title: 'item',
                    description: 'number item description',
                    nodeParameters: {
                        type: NodeType.Number,
                        entity: 'base',
                        layout: 'row',
                    },
                },
            ],
            nodeParameters: {
                type: NodeType.Array,
                entity: 'base',
                layout: 'row',
            },
        },
        table: {
            default: [
                {name: 'John', surname: 'Doe', age: 30},
                {name: 'Jane', surname: 'Smith', age: 25},
            ],
            type: JsonSchemaType.Array,
            title: 'table',
            description: 'array table description',
            items: {
                properties: {
                    name: {
                        title: 'name',
                        description: 'name description',
                        nodeParameters: {
                            type: NodeType.String,
                            entity: 'base',
                            layout: 'cell',
                        },
                    },
                    surname: {
                        title: 'surname',
                        nodeParameters: {
                            type: NodeType.String,
                            entity: 'base',
                            layout: 'cell',
                        },
                    },
                    age: {
                        title: 'age',
                        nodeParameters: {
                            type: NodeType.Number,
                            entity: 'base',
                            layout: 'cell',
                        },
                    },
                },
                title: 'item title',
                nodeParameters: {
                    type: NodeType.Object,
                    entity: 'base',
                    layout: 'accordeon',
                    layoutProps: {
                        withIndent: true,
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Array,
                entity: 'table',
                layout: 'accordeon',
                layoutProps: {
                    withIndent: true,
                },
            },
        },
        number: {
            type: JsonSchemaType.Number,
            title: 'number',
            description: 'number description',
            nodeParameters: {
                type: NodeType.Number,
                entity: 'base',
                layout: 'row',
            },
        },
        string: {
            type: JsonSchemaType.String,
            title: 'string sdjlaksdlj askljdlkasjd asjkldajsl;sadjklajsdklajsllll as',
            description: 'string description',
            nodeParameters: {
                type: NodeType.String,
                entity: 'base',
                layout: 'row',
                layoutProps: {
                    descriptionType: 'bottom',
                    required: true,
                },
            },
        },
        boolean: {
            type: JsonSchemaType.Boolean,
            title: 'boolean',
            description: 'boolean description',
            nodeParameters: {
                type: NodeType.Boolean,
                entity: 'base',
                layout: 'row',
            },
        },
        switch: {
            type: JsonSchemaType.Boolean,
            title: 'switch',
            description: 'switch description',
            nodeParameters: {
                type: NodeType.Boolean,
                entity: 'switch',
                layout: 'row',
            },
        },
        alert: {
            type: JsonSchemaType.String,
            title: 'alert',
            description: 'alert description',
            nodeParameters: {
                type: NodeType.String,
                entity: 'alert',
                layout: 'row',
                entityProps: {
                    iconName: 'CircleExclamationFill',
                    iconProps: {
                        size: 18,
                        color: 'positive',
                    },
                    message: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                    title: 'Alert title',
                    theme: 'info',
                },
            },
        },
        label: {
            default: 'label value',
            type: JsonSchemaType.String,
            title: 'label',
            description: 'label description',
            nodeParameters: {
                type: NodeType.String,
                entity: 'label',
                layout: 'row',
                entityProps: {
                    iconName: 'TriangleExclamation',
                    title: 'Label title',
                    theme: 'clear',
                },
            },
        },
        text_content: {
            type: JsonSchemaType.String,
            title: 'text_content',
            description: 'text content description',
            nodeParameters: {
                type: NodeType.String,
                entity: 'text_content',
                layout: 'row',
                entityProps: {
                    iconName: 'TriangleExclamation',
                },
            },
        },
        password: {
            type: JsonSchemaType.String,
            title: 'password',
            description: 'password description',
            nodeParameters: {
                type: NodeType.String,
                entity: 'password',
                layout: 'row',
            },
        },
        color_picker: {
            type: JsonSchemaType.String,
            default: '#5282ff',
            title: 'color_picker',
            description: 'color picker description',
            nodeParameters: {
                type: NodeType.String,
                entity: 'color_picker',
                layout: 'row',
                entityProps: {
                    withAlpha: true,
                },
            },
        },
        date_input: {
            default: '2020-01-01',
            title: 'date_input',
            description: 'date input description',
            nodeParameters: {
                type: NodeType.Any,
                entity: 'date',
                layout: 'row',
            },
        },
        radio_group: {
            type: JsonSchemaType.String,
            enum: ['foo', 'bar', 'rab'],
            default: 'foo',
            title: 'radio_group',
            description: 'radio group description',
            nodeParameters: {
                type: NodeType.String,
                entity: 'radio_group',
                layout: 'row',
                entityProps: {
                    direction: 'horizontal',
                    enumDescriptions: {
                        foo: 'Option 1',
                        bar: 'Option 2',
                        rab: 'Option 3',
                    },
                },
            },
        },
        segmented_radio_group: {
            type: JsonSchemaType.String,
            enum: ['foo', 'bar', 'rab'],
            default: 'foo',
            title: 'segmented_radio_group',
            description: 'segmented radio group description',
            nodeParameters: {
                type: NodeType.String,
                entity: 'segmented_radio_group',
                layout: 'row',
                entityProps: {
                    enumDescriptions: {
                        foo: 'Option 1',
                        bar: 'Option 2',
                        rab: 'Option 3',
                    },
                },
            },
        },
        select: {
            type: JsonSchemaType.String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
            title: 'select',
            description: 'select description',
            examples: ['Choose status'],
            nodeParameters: {
                type: NodeType.String,
                entity: 'select',
                layout: 'accordeon',
                entityProps: {
                    enumDescriptions: {
                        draft: 'Draft',
                        published: 'Published',
                        archived: 'Archived',
                    },
                    optionsMeta: {
                        draft: 'Draft',
                        published: 'Published',
                        archived: 'Archived',
                    },
                },
            },
        },
        sselect: {
            properties: {
                select: {
                    type: JsonSchemaType.String,
                    enum: ['draft', 'published', 'archived'],
                    default: 'draft',
                    title: 'select',
                    description: 'select description',
                    examples: ['Choose status'],
                    nodeParameters: {
                        type: NodeType.String,
                        entity: 'select',
                        layout: 'accordeon',
                        entityProps: {
                            enumDescriptions: {
                                draft: 'Draft',
                                published: 'Published',
                                archived: 'Archived',
                            },
                            optionsMeta: {
                                draft: 'Draft',
                                published: 'Published',
                                archived: 'Archived',
                            },
                        },
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                entity: 'base',
                layout: 'transparent',
            },
        },
        checkbox_group: {
            type: JsonSchemaType.Array,
            items: {
                type: JsonSchemaType.String,
                enum: ['monday', 'tuesday', 'wednesday'],
            },
            default: ['monday'],
            title: 'checkbox_group',
            nodeParameters: {
                type: NodeType.Array,
                entity: 'checkbox_group',
                layout: 'accordeon',
                entityProps: {
                    direction: 'column',
                    enumDescriptions: {
                        monday: 'Mon',
                        tuesday: 'Tue',
                        wednesday: 'Wed',
                    },
                    optionsDisabled: {
                        monday: true,
                    },
                },
            },
        },
        ccheckbox_group: {
            properties: {
                checkbox_group: {
                    type: JsonSchemaType.Array,
                    items: {
                        type: JsonSchemaType.String,
                        enum: ['monday', 'tuesday', 'wednesday'],
                    },
                    default: ['monday'],
                    title: 'checkbox_group',
                    nodeParameters: {
                        type: NodeType.Array,
                        entity: 'checkbox_group',
                        layout: 'accordeon',
                        entityProps: {
                            direction: 'column',
                            enumDescriptions: {
                                monday: 'Mon',
                                tuesday: 'Tue',
                                wednesday: 'Wed',
                            },
                            optionsDisabled: {
                                monday: true,
                            },
                        },
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                entity: 'base',
                layout: 'transparent',
            },
        },
        multi_select: {
            type: JsonSchemaType.Array,
            items: {enum: ['draft', 'published', 'archived']},
            default: ['draft'],
            examples: [['Choose status']],
            title: 'multi_select',
            nodeParameters: {
                type: NodeType.Array,
                entity: 'select',
                layout: 'row',
                entityProps: {
                    enumDescriptions: {
                        draft: 'Draft',
                        published: 'Published',
                        archived: 'Archived',
                    },
                    optionsMeta: {
                        draft: 'Not visible yet',
                        published: 'Live',
                    },
                },
            },
        },
        slider: {
            type: JsonSchemaType.Number,
            title: 'slider',
            description: 'slider description',
            nodeParameters: {
                type: NodeType.Number,
                entity: 'slider',
                layout: 'row',
            },
        },
        range_slider: {
            default: {from: 0, to: 100},
            type: JsonSchemaType.Object,
            title: 'range_slider',
            properties: {
                from: {type: JsonSchemaType.Number, minimum: 0},
                to: {type: JsonSchemaType.Number, maximum: 100},
            },
            nodeParameters: {
                type: NodeType.Object,
                entity: 'range_slider',
                layout: 'row',
            },
        },
        object_value: {
            type: JsonSchemaType.Object,
            title: 'object_value',
            description: 'object value description',
            properties: {
                value: {
                    type: JsonSchemaType.String,
                    title: 'Value',
                    nodeParameters: {
                        type: NodeType.String,
                        entity: 'base',
                        layout: 'transparent',
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                entity: 'dot_value',
                layout: 'row',
            },
        },
        file: {
            type: JsonSchemaType.String,
            title: 'File Input',
            nodeParameters: {
                type: NodeType.String,
                entity: 'file',
                layout: 'row',
                entityProps: {
                    accept: ['.json', '.txt'],
                    readAsMethod: 'readAsText',
                },
            },
        },
    },
    title: 'Main object',
    description: 'Main object description',
    nodeParameters: {
        type: NodeType.Object,
        entity: 'base',
        layout: 'section',
        layoutProps: {
            descriptionType: 'bottom',
            withIndent: true,
            variant: 'subheader-2',
        },
        overviewEntity: 'base',
    },
};

const value = {
    test: {
        textarea:
            'textarea value min-height: 20px; min-height: 20px; min-height: 20px;min-height: 20px; min-height: 20px; min-height: 20px; min-height: 20px; min-height: 20px; min-height: 20px;',
        monaco: JSON.stringify(
            {
                extends: '@gravity-ui/tsconfig/tsconfig.json',
                include: ['src/**/*.ts', 'src/**/*.tsx'],
                exclude: ['src/stories'],
                compilerOptions: {
                    outDir: 'build/esm',
                    module: 'esnext',
                    jsx: 'react',
                    resolveJsonModule: true,
                    baseUrl: '.',
                    declaration: true,
                    allowJs: true,
                    importHelpers: true,
                    paths: {
                        '@gravity-ui/dynamic-forms/unstable': ['./src/unstable.ts'],
                        '@gravity-ui/uikit/unstable': [
                            'node_modules/@gravity-ui/uikit/build/esm/unstable',
                        ],
                    },
                },
            },
            null,
            2,
        ),
        string_number_with_scale: '1000',
        number_with_scale: 1000,
        range_input: {from: 10, to: 20},
        object_inline: {foo: 'foo', bar: 1, rab: true},
        one_of_nested: {
            foo: {
                foo: 'textarea value',
                bar: 10,
                rab: true,
            },
            bar: 5,
            rab: false,
        },
        few_of_nested: {
            foo: {
                foo: 'textarea value',
                bar: 10,
                rab: true,
            },
            bar: 5,
            rab: true,
        },
        array: ['test', 'test2'],
        tuple: ['test', 123],
        table: [
            {name: 'John', surname: 'Doe', age: 30},
            {name: 'Jane', surname: 'Smith', age: 25},
        ],
        number: 123,
        string: 'test',
        boolean: true,
        switch: true,
        alert: 'alert value',
        label: 'label value',
        text_content: 'value',
        password: 'password',
        color_picker: '#5282ff',
        date_input: '2020-01-01',
        radio_group: 'foo',
        segmented_radio_group: 'foo',
        select: 'draft',
        sselect: {select: 'draft'},
        checkbox_group: ['monday'],
        ccheckbox_group: {checkbox_group: ['monday']},
        multi_select: ['draft'],
        slider: 50,
        range_slider: {from: 0, to: 100},
        object_value: {value: 'test'},
        file: 'file content',
    },
};

const userContext = {MonacoEditor};

// const fields = [
//     'one',
//     'two',
//     'three',
//     'four',
//     'five',
//     'six',
//     'seven',
//     'eight',
//     'nine',
//     'ten',
//     'eleven',
//     'twelve',
//     'thirteen',
//     'fourteen',
//     'fifteen',
//     'sixteen',
//     'seventeen',
//     'eighteen',
//     'nineteen',
//     'twenty',
//     'twenty_one',
//     'twenty_two',
//     'twenty_three',
//     'twenty_four',
//     'twenty_five',
//     'twenty_six',
//     'twenty_seven',
//     'twenty_eight',
//     'twenty_nine',
//     'thirty',
//     'thirty_one',
//     'thirty_two',
//     'thirty_three',
//     'thirty_four',
//     'thirty_five',
//     'thirty_six',
//     'thirty_seven',
//     'thirty_eight',
//     'thirty_nine',
//     'forty',
//     'forty_one',
//     'forty_two',
//     'forty_three',
//     'forty_four',
//     'forty_five',
//     'forty_six',
//     'forty_seven',
//     'forty_eight',
//     'forty_nine',
//     'fifty',
//     'fifty_one',
//     'fifty_two',
//     'fifty_three',
//     'fifty_four',
//     'fifty_five',
//     'fifty_six',
//     'fifty_seven',
//     'fifty_eight',
//     'fifty_nine',
//     'sixty',
//     'sixty_one',
//     'sixty_two',
//     'sixty_three',
//     'sixty_four',
//     'sixty_five',
//     'sixty_six',
//     'sixty_seven',
//     'sixty_eight',
//     'sixty_nine',
//     'seventy',
//     'seventy_one',
//     'seventy_two',
//     'seventy_three',
//     'seventy_four',
//     'seventy_five',
//     'seventy_six',
//     'seventy_seven',
//     'seventy_eight',
//     'seventy_nine',
//     'eighty',
//     'eighty_one',
//     'eighty_two',
//     'eighty_three',
//     'eighty_four',
//     'eighty_five',
//     'eighty_six',
//     'eighty_seven',
//     'eighty_eight',
//     'eighty_nine',
//     'ninety',
//     'ninety_one',
//     'ninety_two',
//     'ninety_three',
//     'ninety_four',
//     'ninety_five',
//     'ninety_six',
//     'ninety_seven',
//     'ninety_eight',
//     'ninety_nine',
//     'hundred',
//     'one_hundred',
//     'one_hundred_one',
//     'one_hundred_two',
//     'one_hundred_three',
//     'one_hundred_four',
//     'one_hundred_five',
//     'one_hundred_six',
//     'one_hundred_seven',
//     'one_hundred_eight',
//     'one_hundred_nine',
//     'one_hundred_ten',
//     'one_hundred_eleven',
//     'one_hundred_twelve',
//     'one_hundred_thirteen',
//     'one_hundred_fourteen',
//     'one_hundred_fifteen',
//     'one_hundred_sixteen',
//     'one_hundred_seventeen',
//     'one_hundred_eighteen',
//     'one_hundred_nineteen',
//     'one_hundred_twenty',
//     'one_hundred_twenty_one',
//     'one_hundred_twenty_two',
//     'one_hundred_twenty_three',
//     'one_hundred_twenty_four',
//     'one_hundred_twenty_five',
//     'one_hundred_twenty_six',
//     'one_hundred_twenty_seven',
//     'one_hundred_twenty_eight',
//     'one_hundred_twenty_nine',
//     'one_hundred_thirty',
//     'one_hundred_thirty_one',
//     'one_hundred_thirty_two',
//     'one_hundred_thirty_three',
//     'one_hundred_thirty_four',
//     'one_hundred_thirty_five',
//     'one_hundred_thirty_six',
//     'one_hundred_thirty_seven',
//     'one_hundred_thirty_eight',
//     'one_hundred_thirty_nine',
//     'one_hundred_forty',
//     'one_hundred_forty_one',
//     'one_hundred_forty_two',
//     'one_hundred_forty_three',
//     'one_hundred_forty_four',
//     'one_hundred_forty_five',
//     'one_hundred_forty_six',
//     'one_hundred_forty_seven',
//     'one_hundred_forty_eight',
//     'one_hundred_forty_nine',
//     'one_hundred_fifty',
//     'one_hundred_fifty_one',
//     'one_hundred_fifty_two',
//     'one_hundred_fifty_three',
//     'one_hundred_fifty_four',
//     'one_hundred_fifty_five',
//     'one_hundred_fifty_six',
//     'one_hundred_fifty_seven',
//     'one_hundred_fifty_eight',
//     'one_hundred_fifty_nine',
//     'one_hundred_sixty',
//     'one_hundred_sixty_one',
//     'one_hundred_sixty_two',
//     'one_hundred_sixty_three',
//     'one_hundred_sixty_four',
//     'one_hundred_sixty_five',
//     'one_hundred_sixty_six',
//     'one_hundred_sixty_seven',
//     'one_hundred_sixty_eight',
//     'one_hundred_sixty_nine',
//     'one_hundred_seventy',
//     'one_hundred_seventy_one',
//     'one_hundred_seventy_two',
//     'one_hundred_seventy_three',
//     'one_hundred_seventy_four',
//     'one_hundred_seventy_five',
//     'one_hundred_seventy_six',
//     'one_hundred_seventy_seven',
//     'one_hundred_seventy_eight',
//     'one_hundred_seventy_nine',
//     'one_hundred_eighty',
//     'one_hundred_eighty_one',
//     'one_hundred_eighty_two',
//     'one_hundred_eighty_three',
//     'one_hundred_eighty_four',
//     'one_hundred_eighty_five',
//     'one_hundred_eighty_six',
//     'one_hundred_eighty_seven',
//     'one_hundred_eighty_eight',
//     'one_hundred_eighty_nine',
//     'one_hundred_ninety',
//     'one_hundred_ninety_one',
//     'one_hundred_ninety_two',
//     'one_hundred_ninety_three',
//     'one_hundred_ninety_four',
//     'one_hundred_ninety_five',
//     'one_hundred_ninety_six',
//     'one_hundred_ninety_seven',
//     'one_hundred_ninety_eight',
//     'one_hundred_ninety_nine',
//     'two_hundred',
//     'two_hundred_one',
//     'two_hundred_two',
//     'two_hundred_three',
//     'two_hundred_four',
//     'two_hundred_five',
//     'two_hundred_six',
//     'two_hundred_seven',
// ];

const template = () => {
    const Template: StoryFn<typeof ObjectBase> = (__) => {
        const [cfg, _setCfg] = React.useState(config);
        const [sch, _setSch] = React.useState(schema);
        const [mode, setMode] = React.useState(SchemaRendererMode.Form);

        React.useEffect(() => {
            setTimeout(() => {
                // setSch(omit(cloneDeep(sch), ['properties.textarea']));
                // setSch({
                //     type: JsonSchemaType.String,
                //     title: 'textarea',
                //     description: 'textarea description',
                //     nodeParameters: {
                //         type: NodeType.String,
                //         entity: 'textarea',
                //         layout: 'row',
                //     },
                // });
            }, 5000);
        }, []);

        return (
            <Form initialValues={value} onSubmit={noop} destroyOnUnregister validateOnBlur={false}>
                {(form) => (
                    <React.Fragment>
                        <SegmentedRadioGroup
                            value={mode}
                            onUpdate={(value) => setMode(value as SchemaRendererMode)}
                        >
                            <SegmentedRadioGroup.Option value={SchemaRendererMode.Form}>
                                Form
                            </SegmentedRadioGroup.Option>
                            <SegmentedRadioGroup.Option value={SchemaRendererMode.Overview}>
                                Overview
                            </SegmentedRadioGroup.Option>
                        </SegmentedRadioGroup>
                        {/* {fields.map((field) => (
                            <SchemaRenderer
                                validateOnBlur={false}
                                key={field}
                                name={field}
                                schema={sch}
                                config={cfg}
                                mode={SchemaRendererMode.Form}
                            />
                        ))} */}
                        <SchemaRenderer
                            validateOnBlur={false}
                            key="test"
                            name="test"
                            schema={sch}
                            config={cfg}
                            mode={mode}
                            userContext={userContext}
                        />
                        <SchemaRenderer
                            validateOnBlur={false}
                            key="test2"
                            name="test2"
                            schema={sch}
                            config={cfg}
                            mode={mode}
                            userContext={userContext}
                        />
                        {/* <SchemaRenderer
                            name="raz"
                            schema={sch}
                            config={cfg}
                            mode={mode}
                            userContext={userContext}
                        /> */}

                        {/* <SchemaRenderer
                        name="qwe.test.jajaja"
                        schema={baseSpec2}
                        config={config}
                        mode={SchemaRendererMode.Form}
                    />
                    <SchemaRenderer
                        name="qwe.test.bocem"
                        schema={baseSpec}
                        config={config}
                        mode={SchemaRendererMode.Form}
                    />
                    <SchemaRenderer
                        name="qwe.test.bocembocem"
                        schema={baseSpec}
                        config={config}
                        mode={SchemaRendererMode.Form}
                    />
                    <SchemaRenderer
                        name="qwe.test.bocembocembocem"
                        schema={baseSpec}
                        config={config}
                        mode={SchemaRendererMode.Form}
                    /> */}
                        <Button onClick={form.handleSubmit}>Submit</Button>
                    </React.Fragment>
                )}
            </Form>
        );
    };

    return Template;
};

export const Base = template();
