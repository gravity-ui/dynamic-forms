import React from 'react';

import type {StoryFn} from '@storybook/react';
import {noop} from 'lodash';
import {Form} from 'react-final-form';

import {ObjectBase} from '../lib';
import {SchemaRenderer} from '../lib/unstable/core/components/SchemaRenderer';
import {JsonSchemaType, SchemaRendererMode} from '../lib/unstable/core/constants';
import {mutators} from '../lib/unstable/core/mutators';
import type {
    JsonSchemaArray,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from '../lib/unstable/core/types';
import type {untypedConfig} from '../lib/unstable/kit/config';
import {config} from '../lib/unstable/kit/config';

export default {
    title: 'Unstable/Base',
    component: ObjectBase,
};

const stringMaxLength: JsonSchemaString<typeof untypedConfig> = {
    type: JsonSchemaType.String,
    maxLength: 1,
    default: 'jaja',
    title: 'stringMaxLength',
    entityParameters: {
        validatorType: 'base',
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            maxLength: 'stringMaxLength',
        },
        // wrapperProps: {
        //     qtest: 'q',
        // },
        // viewProps: {
        //     qw: 'q',
        // },
    },
};

const stringMinLength: JsonSchemaString = {
    type: JsonSchemaType.String,
    minLength: 10,
    default: 'jaja',
    title: 'stringMinLength',
    entityParameters: {
        validatorType: 'async',
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            minLength: 'stringMinLength',
        },
    },
};

const stringPattern: JsonSchemaString = {
    type: JsonSchemaType.String,
    pattern: '[0-9]',
    default: 'jaja',
    title: 'stringPattern',
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            pattern: 'stringPattern',
        },
    },
};

const stringAllOf: JsonSchemaString = {
    type: JsonSchemaType.String,
    default: 'jaja',
    title: 'stringAllOf',
    allOf: [
        {
            type: JsonSchemaType.String,
            minLength: 9,
            entityParameters: {
                errorMessages: {
                    // minLength: 'stringAllOf/minLength from allOf',
                },
            },
        },
        {
            type: JsonSchemaType.String,
            const: 'ja',
            entityParameters: {
                errorMessages: {
                    // const: 'stringAllOf/const from allOf',
                },
            },
        },
    ],
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            minLength: 'stringAllOf/minLength from item',
            const: 'stringAllOf/const from item',
        },
    },
};

const stringAnyOf: JsonSchemaString = {
    type: JsonSchemaType.String,
    default: 'jaja',
    title: 'stringAnyOf',
    anyOf: [
        {
            type: JsonSchemaType.String,
            minLength: 9,
            entityParameters: {
                errorMessages: {
                    // minLength: 'stringAnyOf/minLength from anyOf',
                },
            },
        },
        {
            type: JsonSchemaType.String,
            const: 'ja',
            entityParameters: {
                errorMessages: {
                    // const: 'stringAnyOf/const from anyOf',
                },
            },
        },
    ],
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            minLength: 'stringAnyOf/minLength from item',
            const: 'stringAnyOf/const from item',
            anyOf: 'stringAnyOf',
        },
    },
};

const stringConst: JsonSchemaString = {
    type: JsonSchemaType.String,
    const: 'jajajaja',
    default: 'jaja',
    title: 'stringConst',
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            const: 'stringConst',
        },
    },
};

const stringEnum: JsonSchemaString = {
    type: JsonSchemaType.String,
    enum: ['jajaja', 'bobobo'],
    default: 'jaja',
    title: 'stringEnum',
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            enum: 'stringEnum',
        },
    },
};

const stringThen: JsonSchemaString = {
    type: JsonSchemaType.String,
    default: 'jaja',
    title: 'stringThen',
    if: {
        type: JsonSchemaType.String,
        const: 'jaja',
    },
    else: {
        type: JsonSchemaType.String,
    },
    then: {
        type: JsonSchemaType.String,
        minLength: 5,
    },
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            then: 'stringThen',
        },
    },
};

const stringElse: JsonSchemaString = {
    type: JsonSchemaType.String,
    default: 'jaja',
    title: 'stringElse',
    if: {
        type: JsonSchemaType.String,
        const: 'ja',
    },
    else: {
        type: JsonSchemaType.String,
        minLength: 5,
    },
    then: {
        type: JsonSchemaType.String,
    },
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            else: 'stringElse',
        },
    },
};

const stringNot: JsonSchemaString = {
    type: JsonSchemaType.String,
    default: 'jaja',
    title: 'stringNot',
    not: {
        type: JsonSchemaType.String,
        const: 'jaja',
    },
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            not: 'stringNot',
        },
    },
};

const stringOneOf: JsonSchemaString = {
    type: JsonSchemaType.String,
    default: 'jaja',
    title: 'stringOneOf',
    oneOf: [
        {
            type: JsonSchemaType.String,
            minLength: 9,
            entityParameters: {
                errorMessages: {
                    // minLength: 'stringOneOf/minLength from oneOf',
                },
            },
        },
        {
            type: JsonSchemaType.String,
            const: 'ja',
            entityParameters: {
                errorMessages: {
                    // const: 'stringOneOf/const from oneOf',
                },
            },
        },
    ],
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            minLength: 'stringOneOf from item',
            const: 'stringOneOf from item',
            oneOf: 'stringOneOf',
        },
    },
};

const numberExclusiveMaximum: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    exclusiveMaximum: 2,
    default: 2,
    title: 'numberExclusiveMaximum',
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            exclusiveMaximum: 'numberExclusiveMaximum',
        },
    },
};

const numberExclusiveMinimum: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    exclusiveMinimum: 2,
    default: 2,
    title: 'numberExclusiveMinimum',
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            exclusiveMinimum: 'numberExclusiveMinimum',
        },
    },
};

const numberMaximum: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    maximum: 2,
    default: 3,
    title: 'numberMaximum',
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            maximum: 'numberMaximum',
        },
    },
};

const numberMinimum: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    minimum: 3,
    default: 2,
    title: 'numberMinimum',
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            minimum: 'numberMinimum',
        },
    },
};

const numberMultipleOf: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    multipleOf: 3,
    default: 2,
    title: 'numberMultipleOf',
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        errorMessages: {
            multipleOf: 'numberMultipleOf',
        },
    },
};

const objectAdditionalProperties: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
    },
    default: {extra: 'test'},
    title: 'objectAdditionalProperties',
    additionalProperties: false,
    // additionalProperties: {
    //     type: JsonSchemaType.String,
    //     const: 'jaja',
    //     entityParameters: {
    //         errorMessages: {const: 'objectAdditionalProperties/const'},
    //     },
    // },
    entityParameters: {
        viewType: 'base',
        wrapperType: 'accordeon',
        wrapperProps: {
            open: true,
        },
        errorMessages: {
            additionalProperties: 'objectAdditionalProperties',
        },
    },
};

const objectDependencies: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
        stringEnum: {
            ...stringEnum,
            default: undefined,
        },
        numberMinimum: {
            ...numberMinimum,
            default: undefined,
        },
    },
    title: 'objectDependencies',
    default: {},
    dependencies: {
        stringConst: ['stringEnum', 'numberMinimum'],
        // stringConst: {
        //     type: JsonSchemaType.Object,
        //     properties: {
        //         stringEnum: {
        //             type: JsonSchemaType.String,
        //             maxLength: 1,
        //         },
        //     },
        // },
    },
    entityParameters: {
        viewType: 'base',
        wrapperType: 'accordeon',
        wrapperProps: {
            open: true,
        },
        errorMessages: {
            // dependencies: 'objectDependencies',
            // todo
            // @ts-expect-error
            dependencies: {
                stringEnum: 'objectDependencies/stringEnum',
                numberMinimum: 'objectDependencies/numberMinimum',
            },
        },
    },
};

const objectMaxProperties: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
        stringEnum,
    },
    title: 'objectMaxProperties',
    maxProperties: 1,
    default: {},
    entityParameters: {
        viewType: 'base',
        wrapperType: 'accordeon',
        wrapperProps: {
            open: true,
        },
        errorMessages: {
            maxProperties: 'objectMaxProperties',
        },
    },
};

const objectMinProperties: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
        stringEnum,
    },
    title: 'objectMinProperties',
    minProperties: 3,
    default: {},
    entityParameters: {
        viewType: 'base',
        wrapperType: 'accordeon',
        wrapperProps: {
            open: true,
        },
        errorMessages: {
            minProperties: 'objectMinProperties',
        },
    },
};

const objectPatternProperties: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
        stringEnum,
    },
    title: 'patternProperties',
    default: {},
    patternProperties: {
        '^string': {
            type: JsonSchemaType.Number,
            entityParameters: {errorMessages: {type: 'patternProperties/type'}},
        },
    },
    entityParameters: {
        viewType: 'base',
        wrapperType: 'accordeon',
        wrapperProps: {
            open: true,
        },
    },
};

const objectPropertyNames: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
        stringEnum,
    },
    title: 'objectPropertyNames',
    default: {},
    propertyNames: {
        type: JsonSchemaType.String,
        maxLength: 5,
    },
    entityParameters: {
        viewType: 'base',
        wrapperType: 'accordeon',
        wrapperProps: {
            open: true,
        },
        errorMessages: {
            propertyNames: 'objectPropertyNames',
        },
    },
};

const arrayContains: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    items: {
        type: JsonSchemaType.String,
        title: 'item',
        entityParameters: {
            viewType: 'base',
            wrapperType: 'row',
        },
    },
    contains: true,
    // contains: {
    //     type: JsonSchemaType.String,
    //     const: 'test',
    // },
    title: 'arrayContains',
    default: [],
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        wrapperProps: {
            open: true,
        },
        errorMessages: {
            contains: 'arrayContains',
        },
    },
};

const arrayMaxItems: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    items: {
        type: JsonSchemaType.String,
        title: 'item',
        minLength: 2,
        entityParameters: {
            viewType: 'base',
            wrapperType: 'row',
            errorMessages: {
                minLength: 'stringMinLength',
            },
        },
    },
    maxItems: 1,
    title: 'arrayMaxItems',
    default: ['1', '2'],
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        wrapperProps: {
            open: true,
        },
        errorMessages: {
            maxItems: 'arrayMaxItems',
        },
    },
};

const arrayMinItems: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    items: {
        type: JsonSchemaType.String,
        title: 'item',
        entityParameters: {
            viewType: 'base',
            wrapperType: 'row',
        },
    },
    minItems: 3,
    title: 'arrayMinItems',
    default: ['1', '2'],
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        wrapperProps: {
            open: true,
        },
        errorMessages: {
            minItems: 'arrayMinItems',
        },
    },
};

const arrayUniqueItems: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    items: {
        type: JsonSchemaType.String,
        title: 'item',
        entityParameters: {
            viewType: 'base',
            wrapperType: 'row',
        },
    },
    uniqueItems: true,
    title: 'arrayUniqueItems',
    default: ['1', '1'],
    entityParameters: {
        viewType: 'base',
        wrapperType: 'row',
        wrapperProps: {
            open: true,
        },
        errorMessages: {
            uniqueItems: 'arrayUniqueItems',
        },
    },
};

const baseSpec: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        arrayContains,
        arrayMaxItems,
        arrayMinItems,
        arrayUniqueItems,
        stringMaxLength,
        stringMinLength,
        stringPattern,
        stringAllOf,
        stringAnyOf,
        stringConst,
        stringEnum,
        stringThen,
        stringElse,
        stringNot,
        stringOneOf,
        numberExclusiveMaximum,
        numberExclusiveMinimum,
        numberMaximum,
        numberMinimum,
        numberMultipleOf,
        objectAdditionalProperties,
        objectDependencies,
        objectMaxProperties,
        objectMinProperties,
        objectPatternProperties,
        objectPropertyNames,
    },
    title: 'Candidate',
    entityParameters: {
        viewType: 'base',
        wrapperType: 'accordeon',
        wrapperProps: {
            open: true,
        },
    },
    const: {},
};

const value = {
    qwe: {
        test: {
            // name: 'bocemb',
            age: 13,
            nameQ: 'jaja',
            obj: {name: 'bocemb', age: 13},
        },
    },
};

// new Array(1200).fill('test').forEach((_, idx) => {
//     baseSpec.properties![`test${idx}`] = {
//         type: JsonSchemaType.String,
//         title: 'Name',
//         entityParameters: {
//             viewType: 'base',
//             wrapperType: 'row',
//         },
//         // minLength: 10,
//         // pattern: '^[0-9]',
//         // pattern: '[-_a-zA-Z0-9/.]+$',
//     };
//     baseSpec.required?.push(`test${idx}`);
//     baseSpec.allOf![0].properties![`test${idx}`] = {
//         type: JsonSchemaType.String,
//         minLength: 15,
//     };
// });

const template = () => {
    const Template: StoryFn<typeof ObjectBase> = (__) => (
        <Form initialValues={value} onSubmit={noop} mutators={{...mutators}}>
            {() => (
                <SchemaRenderer
                    name="qwe.test"
                    schema={baseSpec}
                    config={config}
                    mode={SchemaRendererMode.Form}
                />
            )}
        </Form>
    );

    return Template;
};

export const Base = template();
