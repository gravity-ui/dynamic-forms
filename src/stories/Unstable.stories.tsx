import React from 'react';

import {Button} from '@gravity-ui/uikit';
import type {StoryFn} from '@storybook/react';
import {noop} from 'lodash';
import {Form} from 'react-final-form';

import {ObjectBase} from '../lib';
import {SchemaRenderer, schemaRendererMutators} from '../lib/unstable/core';
import {EntityType, JsonSchemaType, SchemaRendererMode} from '../lib/unstable/core/constants';
import type {
    JsonSchema,
    // JsonSchemaAny,
    JsonSchemaArray,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from '../lib/unstable/core/types';
import {type untypedConfig} from '../lib/unstable/kit/config';
import {config} from '../lib/unstable/kit/config';

export default {
    title: 'Unstable/Base',
    component: ObjectBase,
};

// type MyJsonSchemaString<typeof untypedConfig> = JsonSchemaString<typeof untypedConfig>;

const stringMaxLength: JsonSchemaString<typeof untypedConfig> = {
    type: JsonSchemaType.String,
    maxLength: 1,
    default: 'jaja',
    title: 'stringMaxLength',
    entityParameters: {
        type: EntityType.String,
        controlType: 'baseString',
        controlProps: {
            // name: true,
        },
        validatorType: 'baseString',
        // controlType: 'base',
        controlWrapperType: 'rowString',
        errorMessages: {
            maxLength: 'stringMaxLength',
        },
        controlWrapperProps: {
            // qtest: 'q',
            // qwa,
        },
        // viewProps: {
        //     form: {
        //         // qw: 'q',
        //         // clearable: true,
        //         name: true,
        //     },
        // },
        // formProps: {
        //     name: true,
        // }
    },
};

const stringMinLength: JsonSchemaString<typeof untypedConfig> = {
    type: JsonSchemaType.String,
    minLength: 10,
    default: 'jaja',
    title: 'stringMinLength',
    entityParameters: {
        type: EntityType.String,
        // validatorType: 'async',
        controlType: 'baseString',
        controlProps: {},
        controlWrapperType: 'rowString',
        controlWrapperProps: {},
        errorMessages: {
            minLength: 'stringMinLength',
        },
    },
};

const stringPattern: JsonSchemaString<typeof untypedConfig> = {
    type: JsonSchemaType.String,
    pattern: '[0-9]',
    default: 'jaja',
    title: 'stringPattern',
    entityParameters: {
        type: EntityType.String,
        controlType: 'baseString',
        controlWrapperType: 'rowString',
        controlWrapperProps: {},
        errorMessages: {
            pattern: 'stringPattern',
        },
    },
};

const stringAllOf: JsonSchemaString<typeof untypedConfig> = {
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
        type: EntityType.String,
        controlType: 'baseString',
        controlWrapperType: 'rowString',
        errorMessages: {
            minLength: 'stringAllOf/minLength from item',
            const: 'stringAllOf/const from item',
        },
    },
};

const stringAnyOf: JsonSchemaString<typeof untypedConfig> = {
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
        type: EntityType.String,
        controlType: 'baseString',
        controlWrapperType: 'rowString',
        errorMessages: {
            minLength: 'stringAnyOf/minLength from item',
            const: 'stringAnyOf/const from item',
            anyOf: 'stringAnyOf',
        },
    },
};

const stringConst: JsonSchemaString<typeof untypedConfig> = {
    type: JsonSchemaType.String,
    const: 'jajajaja',
    default: 'jaja',
    title: 'stringConst',
    entityParameters: {
        type: EntityType.String,
        controlType: 'baseString',
        controlWrapperType: 'rowString',
        errorMessages: {
            const: 'stringConst',
        },
    },
};

const stringEnum: JsonSchemaString<typeof untypedConfig> = {
    type: JsonSchemaType.String,
    enum: ['jajaja', 'bobobo'],
    default: 'jaja',
    title: 'stringEnum',
    entityParameters: {
        type: EntityType.String,
        controlType: 'baseString',
        controlWrapperType: 'rowString',
        errorMessages: {
            enum: 'stringEnum',
        },
        validatorType: 'cccString',
    },
};

const stringThen: JsonSchemaString<typeof untypedConfig> = {
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
        type: EntityType.String,
        controlType: 'baseString',
        controlWrapperType: 'rowString',
        errorMessages: {
            // then: 'stringThen',
        },
    },
};

const stringElse: JsonSchemaString<typeof untypedConfig> = {
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
        type: EntityType.String,
        controlType: 'baseString',
        controlWrapperType: 'rowString',
        errorMessages: {
            // else: 'stringElse',
        },
    },
};

const stringNot: JsonSchemaString<typeof untypedConfig> = {
    type: JsonSchemaType.String,
    default: 'jaja',
    title: 'stringNot',
    not: {
        type: JsonSchemaType.String,
        const: 'jaja',
    },
    entityParameters: {
        type: EntityType.String,
        controlType: 'baseString',
        controlWrapperType: 'rowString',
        errorMessages: {
            not: 'stringNot',
        },
    },
};

const stringOneOf: JsonSchemaString<typeof untypedConfig> = {
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
        type: EntityType.String,
        controlType: 'baseString',
        controlWrapperType: 'rowString',
        errorMessages: {
            minLength: 'stringOneOf from item',
            const: 'stringOneOf from item',
            oneOf: 'stringOneOf',
        },
    },
};

const numberExclusiveMaximum: JsonSchemaNumber<typeof untypedConfig> = {
    type: JsonSchemaType.Number,
    exclusiveMaximum: 2,
    default: 2,
    title: 'numberExclusiveMaximum',
    entityParameters: {
        type: EntityType.Number,
        controlType: 'baseNumber',
        controlWrapperType: 'rowNumber',
        errorMessages: {
            exclusiveMaximum: 'numberExclusiveMaximum',
        },
    },
};

const numberExclusiveMinimum: JsonSchemaNumber<typeof untypedConfig> = {
    type: JsonSchemaType.Number,
    exclusiveMinimum: 2,
    default: 2,
    title: 'numberExclusiveMinimum',
    entityParameters: {
        type: EntityType.Number,
        controlType: 'baseNumber',
        controlWrapperType: 'rowNumber',
        errorMessages: {
            exclusiveMinimum: 'numberExclusiveMinimum',
        },
    },
};

const numberMaximum: JsonSchemaNumber<typeof untypedConfig> = {
    type: JsonSchemaType.Number,
    maximum: 2,
    default: 3,
    title: 'numberMaximum',
    entityParameters: {
        type: EntityType.Number,
        controlType: 'baseNumber',
        controlWrapperType: 'rowNumber',
        errorMessages: {
            maximum: 'numberMaximum',
        },
    },
};

const numberMinimum: JsonSchemaNumber<typeof untypedConfig> = {
    type: JsonSchemaType.Number,
    minimum: 3,
    default: 2,
    title: 'numberMinimum',
    entityParameters: {
        type: EntityType.Number,
        controlType: 'baseNumber',
        controlWrapperType: 'rowNumber',
        errorMessages: {
            minimum: 'numberMinimum',
        },
    },
};

const numberMultipleOf: JsonSchemaNumber<typeof untypedConfig> = {
    type: JsonSchemaType.Number,
    multipleOf: 3,
    default: 2,
    title: 'numberMultipleOf',
    entityParameters: {
        type: EntityType.Number,
        controlType: 'baseNumber',
        controlWrapperType: 'rowNumber',
        errorMessages: {
            multipleOf: 'numberMultipleOf',
        },
    },
};

const objectAdditionalProperties: JsonSchemaObject<typeof untypedConfig> = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
    },
    default: {extra: 'test'},
    title: 'objectAdditionalProperties',
    // additionalProperties: false,
    additionalProperties: {
        type: JsonSchemaType.String,
        const: 'jaja',
        entityParameters: {
            errorMessages: {const: 'objectAdditionalProperties/const'},
        },
    },
    entityParameters: {
        type: EntityType.Object,
        controlType: 'baseObject',
        controlWrapperType: 'accordeonObject',
        controlWrapperProps: {
            open: true,
        },
        errorMessages: {
            additionalProperties: 'objectAdditionalProperties',
        },
    },
};

const objectDependencies: JsonSchemaObject<typeof untypedConfig> = {
    // <typeof untypedConfig>
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
        type: EntityType.Object,
        controlType: 'baseObject',
        controlWrapperType: 'accordeonObject',
        controlWrapperProps: {
            open: true,
        },
        errorMessages: {
            // dependencies: 'objectDependencies',
            dependencies: {
                stringEnum: 'objectDependencies/stringEnum',
                numberMinimum: 'objectDependencies/numberMinimum',
            },
        },
    },
};

const objectMaxProperties: JsonSchemaObject<typeof untypedConfig> = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
        stringEnum,
    },
    title: 'objectMaxProperties',
    maxProperties: 1,
    default: {},
    entityParameters: {
        type: EntityType.Object,
        controlType: 'baseObject',
        controlWrapperType: 'accordeonObject',
        controlWrapperProps: {
            open: true,
        },
        errorMessages: {
            maxProperties: 'objectMaxProperties',
        },
    },
};

const objectMinProperties: JsonSchemaObject<typeof untypedConfig> = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
        stringEnum,
    },
    title: 'objectMinProperties',
    minProperties: 3,
    default: {},
    entityParameters: {
        type: EntityType.Object,
        controlType: 'baseObject',
        controlWrapperType: 'accordeonObject',
        controlWrapperProps: {
            open: true,
        },
        errorMessages: {
            minProperties: 'objectMinProperties',
        },
    },
};

const objectPatternProperties: JsonSchemaObject<typeof untypedConfig> = {
    type: JsonSchemaType.Object,
    properties: {
        stringConst,
        stringEnum,
    },
    title: 'objectPatternProperties',
    default: {},
    patternProperties: {
        '^string': {
            type: JsonSchemaType.Number,
            entityParameters: {errorMessages: {type: 'patternProperties/type'}},
        },
    },
    entityParameters: {
        type: EntityType.Object,
        controlType: 'baseObject',
        controlWrapperType: 'accordeonObject',
        controlWrapperProps: {
            open: true,
        },
    },
};

const objectPropertyNames: JsonSchemaObject<typeof untypedConfig> = {
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
        type: EntityType.Object,
        controlType: 'baseObject',
        controlWrapperType: 'accordeonObject',
        controlWrapperProps: {
            open: true,
        },
        errorMessages: {
            propertyNames: 'objectPropertyNames',
        },
    },
};

const arrayContains: JsonSchemaArray<typeof untypedConfig> = {
    type: JsonSchemaType.Array,
    items: {
        type: JsonSchemaType.String,
        title: 'item',
        entityParameters: {
            controlType: 'baseString',
            controlWrapperType: 'rowString',
        },
    },
    // contains: true,
    contains: {
        type: JsonSchemaType.String,
        const: 'test',
    },
    title: 'arrayContains',
    default: [],
    entityParameters: {
        type: EntityType.Array,
        controlType: 'baseArray',
        // controlWrapperType: 'row',
        // controlWrapperProps: {
        //     open: true,
        // },
        errorMessages: {
            contains: 'arrayContains',
        },
    },
};

const arrayMaxItems: JsonSchemaArray<typeof untypedConfig> = {
    type: JsonSchemaType.Array,
    items: {
        type: JsonSchemaType.String,
        title: 'item',
        minLength: 2,
        entityParameters: {
            type: EntityType.String,
            controlType: 'baseString',
            controlWrapperType: 'rowString',
            errorMessages: {
                minLength: 'stringMinLength',
            },
        },
    },
    maxItems: 1,
    title: 'arrayMaxItems',
    default: ['1', '2'],
    entityParameters: {
        type: EntityType.Array,
        controlType: 'baseArray',
        controlWrapperType: 'rowArray',
        controlWrapperProps: {
            open: true,
        },
        errorMessages: {
            maxItems: 'arrayMaxItems',
        },
    },
};

const arrayMinItems: JsonSchemaArray<typeof untypedConfig> = {
    type: JsonSchemaType.Array,
    items: {
        type: JsonSchemaType.String,
        title: 'item',
        entityParameters: {
            type: EntityType.String,
            controlType: 'baseString',
            controlWrapperType: 'rowString',
        },
    },
    minItems: 3,
    title: 'arrayMinItems',
    default: ['1', '2'],
    entityParameters: {
        type: EntityType.Array,
        controlType: 'baseArray',
        controlWrapperType: 'rowArray',
        controlWrapperProps: {
            open: true,
        },
        errorMessages: {
            minItems: 'arrayMinItems',
        },
    },
};

const arrayUniqueItems: JsonSchemaArray<typeof untypedConfig> = {
    type: JsonSchemaType.Array,
    items: {
        type: JsonSchemaType.String,
        title: 'item',
        entityParameters: {
            type: EntityType.String,
            controlType: 'baseString',
            controlWrapperType: 'rowString',
        },
    },
    uniqueItems: true,
    title: 'arrayUniqueItems',
    default: ['1', '1'],
    entityParameters: {
        type: EntityType.Array,
        controlType: 'baseArray',
        controlWrapperType: 'rowArray',
        controlWrapperProps: {
            open: true,
        },
        errorMessages: {
            uniqueItems: 'arrayUniqueItems',
        },
    },
};

const anySpec: JsonSchema<typeof untypedConfig> = {
    title: 'anySpec',
    entityParameters: {
        type: EntityType.Any,
        controlType: 'baseAny',
        // controlWrapperType: 'rowAny',
        // validatorType: 'cccAny',
    },
    oneOf: [stringEnum, stringConst],
    items: [stringEnum, arrayUniqueItems],
    properties: {
        stringEnum,
        arrayUniqueItems,
    },
    required: ['stringEnum', 'arrayUniqueItems'],
    additionalProperties: false,
    additionalItems: false,
    uniqueItems: true,
};

const baseSpec: JsonSchemaObject<typeof untypedConfig> = {
    definitions: {
        jajaja: {
            type: JsonSchemaType.String,
            title: 'jajaja',
            minLength: 10,
            entityParameters: {
                type: EntityType.String,
                controlType: 'baseString',
            },
        },
    },
    type: JsonSchemaType.Object,
    properties: {
        test: {
            type: [JsonSchemaType.Object, JsonSchemaType.Null],
            title: 'test',
            properties: {
                test: {
                    type: JsonSchemaType.String,
                    $ref: '#/definitions/jajaja',
                    title: 'test',
                    minLength: 5,
                    maxLength: 2,
                    entityParameters: {
                        type: EntityType.String,
                        controlType: 'baseString',
                        controlWrapperType: 'rowString',
                    },
                },
            },
            entityParameters: {
                type: EntityType.Object,
                controlType: 'baseObject',
                // controlWrapperType: 'row',
                // controlProps: {qq: true},
            },
        },
        anySpec,
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
        // test: {
        //     type: JsonSchemaType.String,
        //     title: 'test',
        //     entityParameters: {
        //         controlType: 'baseString',
        //         controlWrapperType: 'rowString',
        //     },
        // },
    },
    title: 'Candidate',
    entityParameters: {
        type: EntityType.Object,
        controlType: 'baseObject',
        controlWrapperType: 'accordeonObject',
        controlWrapperProps: {
            open: true,
        },
    },
    const: {},
};

const baseSpec2: JsonSchemaObject<typeof untypedConfig> = {
    definitions: {
        jajaja: {
            type: JsonSchemaType.String,
            title: 'jajaja',
            minLength: 10,
            entityParameters: {
                type: EntityType.String,
                controlType: 'baseString',
            },
        },
    },
    type: JsonSchemaType.Object,
    properties: {
        test: {
            type: [JsonSchemaType.Object, JsonSchemaType.Null],
            title: 'test',
            properties: {
                test: {
                    type: JsonSchemaType.String,
                    $ref: '#/definitions/jajaja',
                    title: 'test',
                    minLength: 5,
                    maxLength: 2,
                    entityParameters: {
                        type: EntityType.String,
                        controlType: 'baseString',
                        controlWrapperType: 'rowString',
                    },
                },
            },
            entityParameters: {
                type: EntityType.Object,
                controlType: 'baseObject',
                // controlWrapperType: 'row',
                // controlProps: {qq: true},
            },
        },
        anySpec,
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
        baseSpec,
        s: baseSpec,
        ss: baseSpec,
        sss: baseSpec,
        ssss: baseSpec,
        sssss: baseSpec,
        ssssss: baseSpec,
        sssssss: baseSpec,
        ssssssss: baseSpec,
        sssssssss: baseSpec,
        ssssssssss: baseSpec,
        sssssssssss: baseSpec,
        ssssssssssss: baseSpec,
        sssssssssssss: baseSpec,
        ssssssssssssss: baseSpec,
        sssssssssssssss: baseSpec,
        ssssssssssssssss: baseSpec,
        sssssssssssssssss: baseSpec,
        ssssssssssssssssss: baseSpec,
        sssssssssssssssssss: baseSpec,
        ssssssssssssssssssss: baseSpec,
        // test: {
        //     title: 'test',
        //     properties: {
        //         test: {
        //             title: 'test',
        //             entityParameters: {
        //                 type: EntityType.String,
        //                 controlType: 'baseString',
        //             },
        //         },
        //     },
        //     entityParameters: {
        //         type: EntityType.Object,
        //         controlType: 'baseObject',
        //         // controlWrapperType: 'row',
        //         // controlProps: {qq: true},
        //     },
        // },
    },
    title: 'Candidate',
    entityParameters: {
        type: EntityType.Object,
        controlType: 'baseObject',
        controlWrapperType: 'accordeonObject',
        controlWrapperProps: {
            open: true,
        },
    },
    const: {},
};

const value = {
    qwe: {
        test: {
            jajaja: {
                // name: 'bocemb',
                age: 13,
                nameQ: 'jaja',
                obj: {name: 'bocemb', age: 13},
                baseSpec: {},
                s: {},
                ss: {},
                sss: {},
                ssss: {},
                sssss: {},
                ssssss: {},
                sssssss: {},
                ssssssss: {},
                sssssssss: {},
                ssssssssss: {},
                sssssssssss: {},
                ssssssssssss: {},
                sssssssssssss: {},
                ssssssssssssss: {},
                sssssssssssssss: {},
                ssssssssssssssss: {},
                sssssssssssssssss: {},
                ssssssssssssssssss: {},
                sssssssssssssssssss: {},
                ssssssssssssssssssss: {},
            },
        },
    },
};

// new Array(1200).fill('test').forEach((_, idx) => {
//     baseSpec.properties![`test${idx}`] = {
//         type: JsonSchemaType.String,
//         title: 'Name',
//         entityParameters: {
//             controlType: 'base',
//             controlWrapperType: 'row',
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
        <Form initialValues={value} onSubmit={noop} mutators={{...schemaRendererMutators}}>
            {(form) => (
                <React.Fragment>
                    <SchemaRenderer
                        name="qwe.test.jajaja"
                        schema={baseSpec2}
                        config={config}
                        mode={SchemaRendererMode.Form}
                    />
                    <Button onClick={form.handleSubmit}>Submit</Button>
                </React.Fragment>
            )}
        </Form>
    );

    return Template;
};

export const Base = template();
