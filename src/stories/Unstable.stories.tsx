import React from 'react';

import {Button} from '@gravity-ui/uikit';
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
                formEntityProps: {
                    rows: 10,
                },
                formEntity: 'textarea',
                formLayout: 'row',
                formLayoutProps: {
                    descriptionType: 'tooltip',
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
                formEntity: 'monaco',
                formLayout: 'row',
                formEntityProps: {language: 'json'},
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
                formEntity: 'string_number_with_scale',
                formLayout: 'row',
                formEntityProps: {
                    scale: {
                        km: {title: 'km', factor: '1000'},
                        m: {title: 'm', factor: '1'},
                        cm: {title: 'cm', factor: '0.01'},
                    },
                    defaultType: 'm',
                    overviewEntity: 'km',
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
                formEntity: 'number_with_scale',
                formLayout: 'row',
                formEntityProps: {
                    scale: {
                        km: {title: 'km', factor: 1000},
                        m: {title: 'm', factor: 1},
                        cm: {title: 'cm', factor: 0.01},
                    },
                    defaultType: 'm',
                    viewType: 'km',
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
                        formEntity: 'base',
                        formLayout: 'transparent',
                    },
                },
                to: {
                    type: JsonSchemaType.Number,
                    title: 'to',
                    nodeParameters: defineNodeParameters({
                        type: NodeType.Number,
                        formEntity: 'base',
                        formLayout: 'transparent',
                    }),
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                formEntity: 'range_input',
                formLayout: 'row',
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
                        formEntity: 'select',
                        formLayout: 'transparent',
                    },
                },
                bar: {
                    type: JsonSchemaType.Number,
                    title: 'bar',
                    nodeParameters: {
                        type: NodeType.Number,
                        formEntity: 'base',
                        formLayout: 'transparent',
                    },
                },
                rab: {
                    type: JsonSchemaType.Boolean,
                    title: 'rab',
                    nodeParameters: {
                        type: NodeType.Boolean,
                        formEntity: 'base',
                        formLayout: 'transparent',
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                formEntity: 'inline',
                formLayout: 'row',
                formEntityProps: {
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
                                formEntity: 'base',
                                formLayout: 'row',
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
                                formEntity: 'base',
                                formLayout: 'row',
                            },
                        },
                        rab: {
                            type: JsonSchemaType.Boolean,
                            title: 'rab',
                            nodeParameters: {
                                type: NodeType.Boolean,
                                formEntity: 'base',
                                formLayout: 'row',
                            },
                        },
                    },
                    nodeParameters: {
                        type: NodeType.Object,
                        formEntity: 'base',
                        formLayout: 'section',
                    },
                },
                bar: {
                    type: JsonSchemaType.Number,
                    title: 'bar',
                    nodeParameters: {
                        type: NodeType.Number,
                        formEntity: 'base',
                        formLayout: 'row',
                    },
                },
                rab: {
                    type: JsonSchemaType.Boolean,
                    title: 'rab',
                    nodeParameters: {
                        type: NodeType.Boolean,
                        formEntity: 'base',
                        formLayout: 'row',
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                formEntity: 'one_of_nested',
                formLayout: 'transparent',
                formEntityProps: {
                    booleanToKey: {
                        true: 'foo',
                        false: 'bar',
                    },
                    toggler: {
                        title: 'one of toggler',
                        nodeParameters: {
                            type: NodeType.Boolean,
                            formEntity: 'switch',
                            formLayout: 'row',
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
                                formEntity: 'base',
                                formLayout: 'row',
                            },
                        },
                        bar: {
                            type: JsonSchemaType.Number,
                            title: 'bar',
                            nodeParameters: {
                                type: NodeType.Number,
                                formEntity: 'base',
                                formLayout: 'row',
                            },
                        },
                        rab: {
                            type: JsonSchemaType.Boolean,
                            title: 'rab',
                            nodeParameters: {
                                type: NodeType.Boolean,
                                formEntity: 'base',
                                formLayout: 'row',
                            },
                        },
                    },
                    nodeParameters: {
                        type: NodeType.Object,
                        formEntity: 'base',
                        formLayout: 'section',
                    },
                },
                bar: {
                    type: JsonSchemaType.Number,
                    title: 'bar',
                    nodeParameters: {
                        type: NodeType.Number,
                        formEntity: 'base',
                        formLayout: 'row',
                    },
                },
                rab: {
                    type: JsonSchemaType.Boolean,
                    title: 'rab',
                    nodeParameters: {
                        type: NodeType.Boolean,
                        formEntity: 'base',
                        formLayout: 'row',
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                formEntity: 'few_of_nested',
                formLayout: 'transparent',
                formEntityProps: {
                    toggler: {
                        title: 'few of toggler',
                        items: {
                            enum: ['foo', 'bar', 'rab'],
                        },
                        nodeParameters: {
                            type: NodeType.Array,
                            formEntity: 'select',
                            formLayout: 'row',
                        },
                    },
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
                    formEntity: 'base',
                    formLayout: 'row',
                },
            },
            nodeParameters: {
                type: NodeType.Array,
                formEntity: 'base',
                formLayout: 'card',
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
                        formEntity: 'base',
                        formLayout: 'row',
                    },
                },
                {
                    type: JsonSchemaType.Number,
                    title: 'item',
                    description: 'number item description',
                    nodeParameters: {
                        type: NodeType.Number,
                        formEntity: 'base',
                        formLayout: 'row',
                    },
                },
            ],
            nodeParameters: {
                type: NodeType.Array,
                formEntity: 'base',
                formLayout: 'row',
            },
        },
        array_table: {
            default: [
                {name: 'John', surname: 'Doe', age: 30},
                {name: 'Jane', surname: 'Smith', age: 25},
            ],
            type: JsonSchemaType.Array,
            title: 'array_table',
            description: 'array table description',
            items: {
                properties: {
                    name: {
                        title: 'name',
                        description: 'name description',
                        nodeParameters: {
                            type: NodeType.String,
                            formEntity: 'base',
                            formLayout: 'transparent',
                        },
                    },
                    surname: {
                        title: 'surname',
                        nodeParameters: {
                            type: NodeType.String,
                            formEntity: 'base',
                            formLayout: 'transparent',
                        },
                    },
                    age: {
                        title: 'age',
                        nodeParameters: {
                            type: NodeType.Number,
                            formEntity: 'base',
                            formLayout: 'transparent',
                        },
                    },
                },
                title: 'item title',
                nodeParameters: {
                    type: NodeType.Object,
                    formEntity: 'base',
                    formLayout: 'accordeon',
                    formLayoutProps: {
                        withIndent: true,
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Array,
                formEntity: 'array_table',
                formLayout: 'accordeon',
                formLayoutProps: {
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
                formEntity: 'base',
                formLayout: 'row',
            },
        },
        string: {
            type: JsonSchemaType.String,
            title: 'string sdjlaksdlj askljdlkasjd asjkldajsl;sadjklajsdklajsllll as',
            description: 'string description',
            nodeParameters: {
                type: NodeType.String,
                formEntity: 'base',
                formLayout: 'row',
                formLayoutProps: {
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
                formEntity: 'base',
                formLayout: 'row',
            },
        },
        switch: {
            type: JsonSchemaType.Boolean,
            title: 'switch',
            description: 'switch description',
            nodeParameters: {
                type: NodeType.Boolean,
                formEntity: 'switch',
                formLayout: 'row',
            },
        },
        alert: {
            type: JsonSchemaType.String,
            title: 'alert',
            description: 'alert description',
            nodeParameters: {
                type: NodeType.String,
                formEntity: 'alert',
                formLayout: 'row',
                formEntityProps: {
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
                formEntity: 'label',
                formLayout: 'row',
                formEntityProps: {
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
                formEntity: 'text_content',
                formLayout: 'row',
                formEntityProps: {
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
                formEntity: 'password',
                formLayout: 'row',
            },
        },
        color_picker: {
            type: JsonSchemaType.String,
            default: '#5282ff',
            title: 'color_picker',
            description: 'color picker description',
            nodeParameters: {
                type: NodeType.String,
                formEntity: 'color_picker',
                formLayout: 'row',
                formEntityProps: {
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
                formEntity: 'date_input',
                formLayout: 'row',
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
                formEntity: 'radio_group',
                formLayout: 'row',
                formEntityProps: {
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
                formEntity: 'segmented_radio_group',
                formLayout: 'row',
                formEntityProps: {
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
                formEntity: 'select',
                formLayout: 'accordeon',
                formEntityProps: {
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
                        formEntity: 'select',
                        formLayout: 'accordeon',
                        formEntityProps: {
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
                formEntity: 'base',
                formLayout: 'transparent',
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
                formEntity: 'checkbox_group',
                formLayout: 'accordeon',
                formEntityProps: {
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
                        formEntity: 'checkbox_group',
                        formLayout: 'accordeon',
                        formEntityProps: {
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
                formEntity: 'base',
                formLayout: 'transparent',
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
                formEntity: 'select',
                formLayout: 'row',
                formEntityProps: {
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
                formEntity: 'slider',
                formLayout: 'row',
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
                formEntity: 'range_slider',
                formLayout: 'row',
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
                        formEntity: 'base',
                        formLayout: 'transparent',
                    },
                },
            },
            nodeParameters: {
                type: NodeType.Object,
                formEntity: 'dot_value',
                formLayout: 'row',
            },
        },
        file: {
            type: JsonSchemaType.String,
            title: 'File Input',
            nodeParameters: {
                type: NodeType.String,
                formEntity: 'file',
                formLayout: 'row',
                formEntityProps: {
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
        formEntity: 'base',
        formLayout: 'section',
        formLayoutProps: {
            descriptionType: 'bottom',
            withIndent: true,
            variant: 'subheader-2',
        },
        overviewEntity: 'base',
    },
};

const value = {
    test: {
        array: ['test', 'test2'],
        tuple: ['test', 123],
        number: 123,
        string: 'test',
        boolean: true,
        object_value: {value: 'test'},
        text_content: 'value',
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

        React.useEffect(() => {
            setTimeout(() => {
                // setSch(omit(cloneDeep(sch), ['properties.textarea']));
                // setSch({
                //     type: JsonSchemaType.String,
                //     title: 'textarea',
                //     description: 'textarea description',
                //     nodeParameters: {
                //         type: NodeType.String,
                //         formEntity: 'textarea',
                //         formLayout: 'row',
                //     },
                // });
            }, 5000);
        }, []);

        return (
            <Form initialValues={value} onSubmit={noop} destroyOnUnregister validateOnBlur={false}>
                {(form) => (
                    <React.Fragment>
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
                            mode={SchemaRendererMode.Form}
                            userContext={userContext}
                        />
                        <SchemaRenderer
                            validateOnBlur={false}
                            key="test2"
                            name="test2"
                            schema={sch}
                            config={cfg}
                            mode={SchemaRendererMode.Form}
                            userContext={userContext}
                        />
                        {/* <SchemaRenderer
                            name="raz"
                            schema={sch}
                            config={cfg}
                            mode={SchemaRendererMode.Form}
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
