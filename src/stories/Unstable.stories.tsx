import React from 'react';

import {Button} from '@gravity-ui/uikit';
import type {StoryFn} from '@storybook/react';
import {noop} from 'lodash';
import {Form} from 'react-final-form';

import {ObjectBase} from '../lib';
import {SchemaRenderer, schemaRendererMutators} from '../lib/unstable/core';
import {EntityType, JsonSchemaType, SchemaRendererMode} from '../lib/unstable/core/constants';
import type {
    // JsonSchema,
    // JsonSchemaAny,
    // JsonSchemaArray,
    // JsonSchemaNumber,
    JsonSchemaObject,
    // JsonSchemaString,
} from '../lib/unstable/core/types';
// import {type untypedConfig} from '../lib/unstable/kit/config';
import {type untypedConfig} from '../lib/unstable/kit/constants/config';
import {config} from '../lib/unstable/kit/constants/config';
// import {config} from '../lib/unstable/kit/config';

export default {
    title: 'Unstable/Base',
    component: ObjectBase,
};

// type MyJsonSchemaString<typeof untypedConfig> = JsonSchemaString<typeof untypedConfig>;

// const stringMaxLength: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     maxLength: 1,
//     default: 'jaja',
//     title: 'stringMaxLength',
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlProps: {
//             // name: true,
//         },
//         validatorType: 'baseString',
//         // controlType: 'base',
//         controlWrapperType: 'rowString',
//         errorMessages: {
//             maxLength: 'stringMaxLength',
//         },
//         controlWrapperProps: {
//             // qtest: 'q',
//             // qwa,
//         },
//         // viewProps: {
//         //     form: {
//         //         // qw: 'q',
//         //         // clearable: true,
//         //         name: true,
//         //     },
//         // },
//         // formProps: {
//         //     name: true,
//         // }
//     },
// };

// const stringMinLength: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     minLength: 10,
//     default: 'jaja',
//     title: 'stringMinLength',
//     entityParameters: {
//         type: EntityType.String,
//         // validatorType: 'async',
//         controlType: 'baseString',
//         controlProps: {},
//         controlWrapperType: 'rowString',
//         controlWrapperProps: {},
//         errorMessages: {
//             minLength: 'stringMinLength',
//         },
//     },
// };

// const stringPattern: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     pattern: '[0-9]',
//     default: 'jaja',
//     title: 'stringPattern',
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlWrapperType: 'rowString',
//         controlWrapperProps: {},
//         errorMessages: {
//             pattern: 'stringPattern',
//         },
//     },
// };

// const stringAllOf: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     default: 'jaja',
//     title: 'stringAllOf',
//     allOf: [
//         {
//             type: JsonSchemaType.String,
//             minLength: 9,
//             entityParameters: {
//                 errorMessages: {
//                     // minLength: 'stringAllOf/minLength from allOf',
//                 },
//             },
//         },
//         {
//             type: JsonSchemaType.String,
//             const: 'ja',
//             entityParameters: {
//                 errorMessages: {
//                     // const: 'stringAllOf/const from allOf',
//                 },
//             },
//         },
//     ],
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlWrapperType: 'rowString',
//         errorMessages: {
//             minLength: 'stringAllOf/minLength from item',
//             const: 'stringAllOf/const from item',
//         },
//     },
// };

// const stringAnyOf: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     default: 'jaja',
//     title: 'stringAnyOf',
//     anyOf: [
//         {
//             type: JsonSchemaType.String,
//             minLength: 9,
//             entityParameters: {
//                 errorMessages: {
//                     // minLength: 'stringAnyOf/minLength from anyOf',
//                 },
//             },
//         },
//         {
//             type: JsonSchemaType.String,
//             const: 'ja',
//             entityParameters: {
//                 errorMessages: {
//                     // const: 'stringAnyOf/const from anyOf',
//                 },
//             },
//         },
//     ],
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlWrapperType: 'rowString',
//         errorMessages: {
//             minLength: 'stringAnyOf/minLength from item',
//             const: 'stringAnyOf/const from item',
//             anyOf: 'stringAnyOf',
//         },
//     },
// };

// const stringConst: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     const: 'jajajaja',
//     default: 'jaja',
//     title: 'stringConst',
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlWrapperType: 'rowString',
//         errorMessages: {
//             const: 'stringConst',
//         },
//     },
// };

// const stringEnum: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     enum: ['jajaja', 'bobobo'],
//     default: 'jaja',
//     title: 'stringEnum',
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlWrapperType: 'rowString',
//         errorMessages: {
//             enum: 'stringEnum',
//         },
//         validatorType: 'cccString',
//     },
// };

// const stringThen: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     default: 'jaja',
//     title: 'stringThen',
//     if: {
//         type: JsonSchemaType.String,
//         const: 'jaja',
//     },
//     else: {
//         type: JsonSchemaType.String,
//     },
//     then: {
//         type: JsonSchemaType.String,
//         minLength: 5,
//     },
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlWrapperType: 'rowString',
//         errorMessages: {
//             // then: 'stringThen',
//         },
//     },
// };

// const stringElse: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     default: 'jaja',
//     title: 'stringElse',
//     if: {
//         type: JsonSchemaType.String,
//         const: 'ja',
//     },
//     else: {
//         type: JsonSchemaType.String,
//         minLength: 5,
//     },
//     then: {
//         type: JsonSchemaType.String,
//     },
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlWrapperType: 'rowString',
//         errorMessages: {
//             // else: 'stringElse',
//         },
//     },
// };

// const stringNot: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     default: 'jaja',
//     title: 'stringNot',
//     not: {
//         type: JsonSchemaType.String,
//         const: 'jaja',
//     },
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlWrapperType: 'rowString',
//         errorMessages: {
//             not: 'stringNot',
//         },
//     },
// };

// const stringOneOf: JsonSchemaString<typeof untypedConfig> = {
//     type: JsonSchemaType.String,
//     default: 'jaja',
//     title: 'stringOneOf',
//     oneOf: [
//         {
//             type: JsonSchemaType.String,
//             minLength: 9,
//             entityParameters: {
//                 errorMessages: {
//                     // minLength: 'stringOneOf/minLength from oneOf',
//                 },
//             },
//         },
//         {
//             type: JsonSchemaType.String,
//             const: 'ja',
//             entityParameters: {
//                 errorMessages: {
//                     // const: 'stringOneOf/const from oneOf',
//                 },
//             },
//         },
//     ],
//     entityParameters: {
//         type: EntityType.String,
//         controlType: 'baseString',
//         controlWrapperType: 'rowString',
//         errorMessages: {
//             minLength: 'stringOneOf from item',
//             const: 'stringOneOf from item',
//             oneOf: 'stringOneOf',
//         },
//     },
// };

// const numberExclusiveMaximum: JsonSchemaNumber<typeof untypedConfig> = {
//     type: JsonSchemaType.Number,
//     exclusiveMaximum: 2,
//     default: 2,
//     title: 'numberExclusiveMaximum',
//     entityParameters: {
//         type: EntityType.Number,
//         controlType: 'baseNumber',
//         controlWrapperType: 'rowNumber',
//         errorMessages: {
//             exclusiveMaximum: 'numberExclusiveMaximum',
//         },
//     },
// };

// const numberExclusiveMinimum: JsonSchemaNumber<typeof untypedConfig> = {
//     type: JsonSchemaType.Number,
//     exclusiveMinimum: 2,
//     default: 2,
//     title: 'numberExclusiveMinimum',
//     entityParameters: {
//         type: EntityType.Number,
//         controlType: 'baseNumber',
//         controlWrapperType: 'rowNumber',
//         errorMessages: {
//             exclusiveMinimum: 'numberExclusiveMinimum',
//         },
//     },
// };

// const numberMaximum: JsonSchemaNumber<typeof untypedConfig> = {
//     type: JsonSchemaType.Number,
//     maximum: 2,
//     default: 3,
//     title: 'numberMaximum',
//     entityParameters: {
//         type: EntityType.Number,
//         controlType: 'baseNumber',
//         controlWrapperType: 'rowNumber',
//         errorMessages: {
//             maximum: 'numberMaximum',
//         },
//     },
// };

// const numberMinimum: JsonSchemaNumber<typeof untypedConfig> = {
//     type: JsonSchemaType.Number,
//     minimum: 3,
//     default: 2,
//     title: 'numberMinimum',
//     entityParameters: {
//         type: EntityType.Number,
//         controlType: 'baseNumber',
//         controlWrapperType: 'rowNumber',
//         errorMessages: {
//             minimum: 'numberMinimum',
//         },
//     },
// };

// const numberMultipleOf: JsonSchemaNumber<typeof untypedConfig> = {
//     type: JsonSchemaType.Number,
//     multipleOf: 3,
//     default: 2,
//     title: 'numberMultipleOf',
//     entityParameters: {
//         type: EntityType.Number,
//         controlType: 'baseNumber',
//         controlWrapperType: 'rowNumber',
//         errorMessages: {
//             multipleOf: 'numberMultipleOf',
//         },
//     },
// };

// const objectAdditionalProperties: JsonSchemaObject<typeof untypedConfig> = {
//     type: JsonSchemaType.Object,
//     properties: {
//         stringConst,
//     },
//     default: {extra: 'test'},
//     title: 'objectAdditionalProperties',
//     // additionalProperties: false,
//     additionalProperties: {
//         type: JsonSchemaType.String,
//         const: 'jaja',
//         entityParameters: {
//             errorMessages: {const: 'objectAdditionalProperties/const'},
//         },
//     },
//     entityParameters: {
//         type: EntityType.Object,
//         controlType: 'baseObject',
//         controlWrapperType: 'accordeonObject',
//         controlWrapperProps: {
//             open: true,
//         },
//         errorMessages: {
//             additionalProperties: 'objectAdditionalProperties',
//         },
//     },
// };

// const objectDependencies: JsonSchemaObject<typeof untypedConfig> = {
//     // <typeof untypedConfig>
//     type: JsonSchemaType.Object,
//     properties: {
//         stringConst,
//         stringEnum: {
//             ...stringEnum,
//             default: undefined,
//         },
//         numberMinimum: {
//             ...numberMinimum,
//             default: undefined,
//         },
//     },
//     title: 'objectDependencies',
//     default: {},
//     dependencies: {
//         stringConst: ['stringEnum', 'numberMinimum'],
//         // stringConst: {
//         //     type: JsonSchemaType.Object,
//         //     properties: {
//         //         stringEnum: {
//         //             type: JsonSchemaType.String,
//         //             maxLength: 1,
//         //         },
//         //     },
//         // },
//     },
//     entityParameters: {
//         type: EntityType.Object,
//         controlType: 'baseObject',
//         controlWrapperType: 'accordeonObject',
//         controlWrapperProps: {
//             open: true,
//         },
//         errorMessages: {
//             // dependencies: 'objectDependencies',
//             dependencies: {
//                 stringEnum: 'objectDependencies/stringEnum',
//                 numberMinimum: 'objectDependencies/numberMinimum',
//             },
//         },
//     },
// };

// const objectMaxProperties: JsonSchemaObject<typeof untypedConfig> = {
//     type: JsonSchemaType.Object,
//     properties: {
//         stringConst,
//         stringEnum,
//     },
//     title: 'objectMaxProperties',
//     maxProperties: 1,
//     default: {},
//     entityParameters: {
//         type: EntityType.Object,
//         controlType: 'baseObject',
//         controlWrapperType: 'accordeonObject',
//         controlWrapperProps: {
//             open: true,
//         },
//         errorMessages: {
//             maxProperties: 'objectMaxProperties',
//         },
//     },
// };

// const objectMinProperties: JsonSchemaObject<typeof untypedConfig> = {
//     type: JsonSchemaType.Object,
//     properties: {
//         stringConst,
//         stringEnum,
//     },
//     title: 'objectMinProperties',
//     minProperties: 3,
//     default: {},
//     entityParameters: {
//         type: EntityType.Object,
//         controlType: 'baseObject',
//         controlWrapperType: 'accordeonObject',
//         controlWrapperProps: {
//             open: true,
//         },
//         errorMessages: {
//             minProperties: 'objectMinProperties',
//         },
//     },
// };

// const objectPatternProperties: JsonSchemaObject<typeof untypedConfig> = {
//     type: JsonSchemaType.Object,
//     properties: {
//         stringConst,
//         stringEnum,
//     },
//     title: 'objectPatternProperties',
//     default: {},
//     patternProperties: {
//         '^string': {
//             type: JsonSchemaType.Number,
//             entityParameters: {errorMessages: {type: 'patternProperties/type'}},
//         },
//     },
//     entityParameters: {
//         type: EntityType.Object,
//         controlType: 'baseObject',
//         controlWrapperType: 'accordeonObject',
//         controlWrapperProps: {
//             open: true,
//         },
//     },
// };

// const objectPropertyNames: JsonSchemaObject<typeof untypedConfig> = {
//     type: JsonSchemaType.Object,
//     properties: {
//         stringConst,
//         stringEnum,
//     },
//     title: 'objectPropertyNames',
//     default: {},
//     propertyNames: {
//         type: JsonSchemaType.String,
//         maxLength: 5,
//     },
//     entityParameters: {
//         type: EntityType.Object,
//         controlType: 'baseObject',
//         controlWrapperType: 'accordeonObject',
//         controlWrapperProps: {
//             open: true,
//         },
//         errorMessages: {
//             propertyNames: 'objectPropertyNames',
//         },
//     },
// };

// const arrayContains: JsonSchemaArray<typeof untypedConfig> = {
//     type: JsonSchemaType.Array,
//     items: {
//         type: JsonSchemaType.String,
//         title: 'item',
//         entityParameters: {
//             controlType: 'baseString',
//             controlWrapperType: 'rowString',
//         },
//     },
//     // contains: true,
//     contains: {
//         type: JsonSchemaType.String,
//         const: 'test',
//     },
//     title: 'arrayContains',
//     default: [],
//     entityParameters: {
//         type: EntityType.Array,
//         controlType: 'baseArray',
//         // controlWrapperType: 'row',
//         // controlWrapperProps: {
//         //     open: true,
//         // },
//         errorMessages: {
//             contains: 'arrayContains',
//         },
//     },
// };

// const arrayMaxItems: JsonSchemaArray<typeof untypedConfig> = {
//     type: JsonSchemaType.Array,
//     items: {
//         type: JsonSchemaType.String,
//         title: 'item',
//         minLength: 2,
//         entityParameters: {
//             type: EntityType.String,
//             controlType: 'baseString',
//             controlWrapperType: 'rowString',
//             errorMessages: {
//                 minLength: 'stringMinLength',
//             },
//         },
//     },
//     maxItems: 1,
//     title: 'arrayMaxItems',
//     default: ['1', '2'],
//     entityParameters: {
//         type: EntityType.Array,
//         controlType: 'baseArray',
//         controlWrapperType: 'rowArray',
//         controlWrapperProps: {
//             open: true,
//         },
//         errorMessages: {
//             maxItems: 'arrayMaxItems',
//         },
//     },
// };

// const arrayMinItems: JsonSchemaArray<typeof untypedConfig> = {
//     type: JsonSchemaType.Array,
//     items: {
//         type: JsonSchemaType.String,
//         title: 'item',
//         entityParameters: {
//             type: EntityType.String,
//             controlType: 'baseString',
//             controlWrapperType: 'rowString',
//         },
//     },
//     minItems: 3,
//     title: 'arrayMinItems',
//     default: ['1', '2'],
//     entityParameters: {
//         type: EntityType.Array,
//         controlType: 'baseArray',
//         controlWrapperType: 'rowArray',
//         controlWrapperProps: {
//             open: true,
//         },
//         errorMessages: {
//             minItems: 'arrayMinItems',
//         },
//     },
// };

// const arrayUniqueItems: JsonSchemaArray<typeof untypedConfig> = {
//     type: JsonSchemaType.Array,
//     items: {
//         type: JsonSchemaType.String,
//         title: 'item',
//         entityParameters: {
//             type: EntityType.String,
//             controlType: 'baseString',
//             controlWrapperType: 'rowString',
//         },
//     },
//     uniqueItems: true,
//     title: 'arrayUniqueItems',
//     default: ['1', '1'],
//     entityParameters: {
//         type: EntityType.Array,
//         controlType: 'baseArray',
//         controlWrapperType: 'rowArray',
//         controlWrapperProps: {
//             open: true,
//         },
//         errorMessages: {
//             uniqueItems: 'arrayUniqueItems',
//         },
//     },
// };

// const anySpec: JsonSchema<typeof untypedConfig> = {
//     title: 'anySpec',
//     entityParameters: {
//         type: EntityType.Any,
//         controlType: 'baseAny',
//         // controlWrapperType: 'rowAny',
//         // validatorType: 'cccAny',
//     },
//     oneOf: [stringEnum, stringConst],
//     items: [stringEnum, arrayUniqueItems],
//     properties: {
//         stringEnum,
//         arrayUniqueItems,
//     },
//     required: ['stringEnum', 'arrayUniqueItems'],
//     additionalProperties: false,
//     additionalItems: false,
//     uniqueItems: true,
// };

// const baseSpec: JsonSchemaObject<typeof untypedConfig> = {
//     definitions: {
//         jajaja: {
//             type: JsonSchemaType.String,
//             title: 'jajaja',
//             minLength: 10,
//             entityParameters: {
//                 type: EntityType.String,
//                 controlType: 'baseString',
//             },
//         },
//     },
//     type: JsonSchemaType.Object,
//     properties: {
//         test: {
//             type: [JsonSchemaType.Object, JsonSchemaType.Null],
//             title: 'test',
//             properties: {
//                 test: {
//                     type: JsonSchemaType.String,
//                     $ref: '#/definitions/jajaja',
//                     title: 'test',
//                     minLength: 5,
//                     maxLength: 2,
//                     entityParameters: {
//                         type: EntityType.String,
//                         controlType: 'baseString',
//                         controlWrapperType: 'rowString',
//                     },
//                 },
//             },
//             entityParameters: {
//                 type: EntityType.Object,
//                 controlType: 'baseObject',
//                 // controlWrapperType: 'row',
//                 // controlProps: {qq: true},
//             },
//         },
//         anySpec,
//         arrayContains,
//         arrayMaxItems,
//         arrayMinItems,
//         arrayUniqueItems,
//         stringMaxLength,
//         stringMinLength,
//         stringPattern,
//         stringAllOf,
//         stringAnyOf,
//         stringConst,
//         stringEnum,
//         stringThen,
//         stringElse,
//         stringNot,
//         stringOneOf,
//         numberExclusiveMaximum,
//         numberExclusiveMinimum,
//         numberMaximum,
//         numberMinimum,
//         numberMultipleOf,
//         objectAdditionalProperties,
//         objectDependencies,
//         objectMaxProperties,
//         objectMinProperties,
//         objectPatternProperties,
//         objectPropertyNames,
//         // test: {
//         //     type: JsonSchemaType.String,
//         //     title: 'test',
//         //     entityParameters: {
//         //         controlType: 'baseString',
//         //         controlWrapperType: 'rowString',
//         //     },
//         // },
//     },
//     title: 'Candidate',
//     entityParameters: {
//         type: EntityType.Object,
//         controlType: 'baseObject',
//         controlWrapperType: 'accordeonObject',
//         controlWrapperProps: {
//             open: true,
//         },
//     },
//     const: {},
// };

// const baseSpec2: JsonSchemaObject<typeof untypedConfig> = {
//     definitions: {
//         jajaja: {
//             type: JsonSchemaType.String,
//             title: 'jajaja',
//             minLength: 10,
//             entityParameters: {
//                 type: EntityType.String,
//                 controlType: 'baseString',
//             },
//         },
//     },
//     type: JsonSchemaType.Object,
//     properties: {
//         test: {
//             type: [JsonSchemaType.Object, JsonSchemaType.Null],
//             title: 'test',
//             properties: {
//                 test: {
//                     type: JsonSchemaType.String,
//                     $ref: '#/definitions/jajaja',
//                     title: 'test',
//                     minLength: 5,
//                     maxLength: 2,
//                     entityParameters: {
//                         type: EntityType.String,
//                         controlType: 'baseString',
//                         controlWrapperType: 'rowString',
//                     },
//                 },
//             },
//             entityParameters: {
//                 type: EntityType.Object,
//                 controlType: 'baseObject',
//                 // controlWrapperType: 'row',
//                 // controlProps: {qq: true},
//             },
//         },
//         anySpec,
//         arrayContains,
//         arrayMaxItems,
//         arrayMinItems,
//         arrayUniqueItems,
//         stringMaxLength,
//         stringMinLength,
//         stringPattern,
//         stringAllOf,
//         stringAnyOf,
//         stringConst,
//         stringEnum,
//         stringThen,
//         stringElse,
//         stringNot,
//         stringOneOf,
//         numberExclusiveMaximum,
//         numberExclusiveMinimum,
//         numberMaximum,
//         numberMinimum,
//         numberMultipleOf,
//         objectAdditionalProperties,
//         objectDependencies,
//         objectMaxProperties,
//         objectMinProperties,
//         objectPatternProperties,
//         objectPropertyNames,
//         baseSpec,
//         s: baseSpec,
//         ss: baseSpec,
//         sss: baseSpec,
//         ssss: baseSpec,
//         sssss: baseSpec,
//         ssssss: baseSpec,
//         sssssss: baseSpec,
//         ssssssss: baseSpec,
//         sssssssss: baseSpec,
//         ssssssssss: baseSpec,
//         sssssssssss: baseSpec,
//         ssssssssssss: baseSpec,
//         sssssssssssss: baseSpec,
//         ssssssssssssss: baseSpec,
//         sssssssssssssss: baseSpec,
//         ssssssssssssssss: baseSpec,
//         sssssssssssssssss: baseSpec,
//         ssssssssssssssssss: baseSpec,
//         sssssssssssssssssss: baseSpec,
//         ssssssssssssssssssss: baseSpec,
//         // test: {
//         //     title: 'test',
//         //     properties: {
//         //         test: {
//         //             title: 'test',
//         //             entityParameters: {
//         //                 type: EntityType.String,
//         //                 controlType: 'baseString',
//         //             },
//         //         },
//         //     },
//         //     entityParameters: {
//         //         type: EntityType.Object,
//         //         controlType: 'baseObject',
//         //         // controlWrapperType: 'row',
//         //         // controlProps: {qq: true},
//         //     },
//         // },
//     },
//     title: 'Candidate',
//     entityParameters: {
//         type: EntityType.Object,
//         controlType: 'baseObject',
//         controlWrapperType: 'accordeonObject',
//         controlWrapperProps: {
//             open: true,
//         },
//     },
//     const: {},
// };

// const baseValue = {
//     qwe: {
//         test: {
//             jajaja: {
//                 // name: 'bocemb',
//                 age: 13,
//                 nameQ: 'jaja',
//                 obj: {name: 'bocemb', age: 13},
//                 baseSpec: {},
//                 s: {},
//                 ss: {},
//                 sss: {},
//                 ssss: {},
//                 sssss: {},
//                 ssssss: {},
//                 sssssss: {},
//                 ssssssss: {},
//                 sssssssss: {},
//                 ssssssssss: {},
//                 sssssssssss: {},
//                 ssssssssssss: {},
//                 sssssssssssss: {},
//                 ssssssssssssss: {},
//                 sssssssssssssss: {},
//                 ssssssssssssssss: {},
//                 sssssssssssssssss: {},
//                 ssssssssssssssssss: {},
//                 sssssssssssssssssss: {},
//                 ssssssssssssssssssss: {},
//             },
//             bocem: {
//                 // name: 'bocemb',
//                 age: 13,
//                 nameQ: 'jaja',
//                 obj: {name: 'bocemb', age: 13},
//                 baseSpec: {},
//                 s: {},
//                 ss: {},
//                 sss: {},
//                 ssss: {},
//                 sssss: {},
//                 ssssss: {},
//                 sssssss: {},
//                 ssssssss: {},
//                 sssssssss: {},
//                 ssssssssss: {},
//                 sssssssssss: {},
//                 ssssssssssss: {},
//                 sssssssssssss: {},
//                 ssssssssssssss: {},
//                 sssssssssssssss: {},
//                 ssssssssssssssss: {},
//                 sssssssssssssssss: {},
//                 ssssssssssssssssss: {},
//                 sssssssssssssssssss: {},
//                 ssssssssssssssssssss: {},
//             },
//             bocembocem: {
//                 // name: 'bocemb',
//                 age: 13,
//                 nameQ: 'jaja',
//                 obj: {name: 'bocemb', age: 13},
//                 baseSpec: {},
//                 s: {},
//                 ss: {},
//                 sss: {},
//                 ssss: {},
//                 sssss: {},
//                 ssssss: {},
//                 sssssss: {},
//                 ssssssss: {},
//                 sssssssss: {},
//                 ssssssssss: {},
//                 sssssssssss: {},
//                 ssssssssssss: {},
//                 sssssssssssss: {},
//                 ssssssssssssss: {},
//                 sssssssssssssss: {},
//                 ssssssssssssssss: {},
//                 sssssssssssssssss: {},
//                 ssssssssssssssssss: {},
//                 sssssssssssssssssss: {},
//                 ssssssssssssssssssss: {},
//             },
//             bocembocembocem: {
//                 // name: 'bocemb',
//                 age: 13,
//                 nameQ: 'jaja',
//                 obj: {name: 'bocemb', age: 13},
//                 baseSpec: {},
//                 s: {},
//                 ss: {},
//                 sss: {},
//                 ssss: {},
//                 sssss: {},
//                 ssssss: {},
//                 sssssss: {},
//                 ssssssss: {},
//                 sssssssss: {},
//                 ssssssssss: {},
//                 sssssssssss: {},
//                 ssssssssssss: {},
//                 sssssssssssss: {},
//                 ssssssssssssss: {},
//                 sssssssssssssss: {},
//                 ssssssssssssssss: {},
//                 sssssssssssssssss: {},
//                 ssssssssssssssssss: {},
//                 sssssssssssssssssss: {},
//                 ssssssssssssssssssss: {},
//             },
//         },
//     },
// };

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

const schema: JsonSchemaObject<typeof untypedConfig> = {
    type: JsonSchemaType.Object,
    properties: {
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
            entityParameters: {
                type: EntityType.String,
                controlType: 'string_number_with_scale',
                controlWrapperType: 'row',
                controlProps: {
                    scale: {
                        km: {title: 'km', factor: '1000'},
                        m: {title: 'm', factor: '1'},
                        cm: {title: 'cm', factor: '0.01'},
                    },
                    defaultType: 'm',
                    viewType: 'km',
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
            entityParameters: {
                type: EntityType.Number,
                controlType: 'number_with_scale',
                controlWrapperType: 'row',
                controlProps: {
                    scale: {
                        km: {title: 'km', factor: 1000},
                        m: {title: 'm', factor: 1},
                        cm: {title: 'cm', factor: 0.01},
                    },
                    defaultType: 'm',
                    viewType: 'km',
                },
            },
        },
        range_input: {
            type: JsonSchemaType.Object,
            title: 'range_input',
            description: 'range input description',
            properties: {
                from: {
                    type: JsonSchemaType.Number,
                    title: 'from',
                    entityParameters: {
                        type: EntityType.Number,
                        controlType: 'base',
                        controlWrapperType: 'transparent',
                    },
                },
                to: {
                    type: JsonSchemaType.Number,
                    title: 'to',
                    entityParameters: {
                        type: EntityType.Number,
                        controlType: 'base',
                        controlWrapperType: 'transparent',
                    },
                },
            },
            entityParameters: {
                type: EntityType.Object,
                controlType: 'range_input',
                controlWrapperType: 'row',
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
                    entityParameters: {
                        type: EntityType.String,
                        controlType: 'select',
                        controlWrapperType: 'transparent',
                    },
                },
                bar: {
                    type: JsonSchemaType.Number,
                    title: 'bar',
                    entityParameters: {
                        type: EntityType.Number,
                        controlType: 'base',
                        controlWrapperType: 'transparent',
                    },
                },
                rab: {
                    type: JsonSchemaType.Boolean,
                    title: 'rab',
                    entityParameters: {
                        type: EntityType.Boolean,
                        controlType: 'base',
                        controlWrapperType: 'transparent',
                    },
                },
            },
            entityParameters: {
                type: EntityType.Object,
                controlType: 'inline',
                controlWrapperType: 'row',
                controlProps: {
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
                            type: JsonSchemaType.String,
                            title: 'foo',
                            entityParameters: {
                                type: EntityType.String,
                                controlType: 'base',
                                controlWrapperType: 'row',
                            },
                        },
                        bar: {
                            type: JsonSchemaType.Number,
                            title: 'bar',
                            entityParameters: {
                                type: EntityType.Number,
                                controlType: 'base',
                                controlWrapperType: 'row',
                            },
                        },
                        rab: {
                            type: JsonSchemaType.Boolean,
                            title: 'rab',
                            entityParameters: {
                                type: EntityType.Boolean,
                                controlType: 'base',
                                controlWrapperType: 'row',
                            },
                        },
                    },
                    entityParameters: {
                        type: EntityType.Object,
                        controlType: 'base',
                        controlWrapperType: 'section',
                    },
                },
                bar: {
                    type: JsonSchemaType.Number,
                    title: 'bar',
                    entityParameters: {
                        type: EntityType.Number,
                        controlType: 'base',
                        controlWrapperType: 'row',
                    },
                },
                rab: {
                    type: JsonSchemaType.Boolean,
                    title: 'rab',
                    entityParameters: {
                        type: EntityType.Boolean,
                        controlType: 'base',
                        controlWrapperType: 'row',
                    },
                },
            },
            entityParameters: {
                type: EntityType.Object,
                controlType: 'one_of_nested',
                controlWrapperType: 'transparent',
                controlProps: {
                    booleanToKey: {
                        true: 'foo',
                        false: 'bar',
                    },
                    toggler: {
                        title: 'one of toggler',
                        entityParameters: {
                            type: EntityType.Boolean,
                            controlType: 'switch',
                            controlWrapperType: 'row',
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
                            type: JsonSchemaType.String,
                            title: 'foo',
                            entityParameters: {
                                type: EntityType.String,
                                controlType: 'base',
                                controlWrapperType: 'row',
                            },
                        },
                        bar: {
                            type: JsonSchemaType.Number,
                            title: 'bar',
                            entityParameters: {
                                type: EntityType.Number,
                                controlType: 'base',
                                controlWrapperType: 'row',
                            },
                        },
                        rab: {
                            type: JsonSchemaType.Boolean,
                            title: 'rab',
                            entityParameters: {
                                type: EntityType.Boolean,
                                controlType: 'base',
                                controlWrapperType: 'row',
                            },
                        },
                    },
                    entityParameters: {
                        type: EntityType.Object,
                        controlType: 'base',
                        controlWrapperType: 'section',
                    },
                },
                bar: {
                    type: JsonSchemaType.Number,
                    title: 'bar',
                    entityParameters: {
                        type: EntityType.Number,
                        controlType: 'base',
                        controlWrapperType: 'row',
                    },
                },
                rab: {
                    type: JsonSchemaType.Boolean,
                    title: 'rab',
                    entityParameters: {
                        type: EntityType.Boolean,
                        controlType: 'base',
                        controlWrapperType: 'row',
                    },
                },
            },
            entityParameters: {
                type: EntityType.Object,
                controlType: 'few_of_nested',
                controlWrapperType: 'transparent',
                controlProps: {
                    toggler: {
                        title: 'few of toggler',
                        items: {
                            enum: ['foo', 'bar', 'rab'],
                        },
                        entityParameters: {
                            type: EntityType.Array,
                            controlType: 'select',
                            controlWrapperType: 'row',
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
                entityParameters: {
                    type: EntityType.String,
                    controlType: 'base',
                    controlWrapperType: 'transparent',
                },
            },
            entityParameters: {
                type: EntityType.Array,
                controlType: 'base',
                controlWrapperType: 'row',
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
                    entityParameters: {
                        type: EntityType.String,
                        controlType: 'base',
                        controlWrapperType: 'row',
                    },
                },
                {
                    type: JsonSchemaType.Number,
                    title: 'item',
                    description: 'number item description',
                    entityParameters: {
                        type: EntityType.Number,
                        controlType: 'base',
                        controlWrapperType: 'row',
                    },
                },
            ],
            entityParameters: {
                type: EntityType.Array,
                controlType: 'base',
                controlWrapperType: 'row',
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
                        entityParameters: {
                            type: EntityType.String,
                            controlType: 'base',
                            controlWrapperType: 'transparent',
                        },
                    },
                    surname: {
                        title: 'surname',
                        entityParameters: {
                            type: EntityType.String,
                            controlType: 'base',
                            controlWrapperType: 'transparent',
                        },
                    },
                    age: {
                        title: 'age',
                        entityParameters: {
                            type: EntityType.Number,
                            controlType: 'base',
                            controlWrapperType: 'transparent',
                        },
                    },
                },
                title: 'item title',
                entityParameters: {
                    type: EntityType.Object,
                    controlType: 'base',
                    controlWrapperType: 'accordeon',
                    controlWrapperProps: {
                        withIndent: true,
                    },
                },
            },
            entityParameters: {
                type: EntityType.Array,
                controlType: 'array_table',
                controlWrapperType: 'accordeon',
                controlWrapperProps: {
                    withIndent: true,
                },
            },
        },
        number: {
            type: JsonSchemaType.Number,
            title: 'number',
            description: 'number description',
            entityParameters: {
                type: EntityType.Number,
                controlType: 'base',
                controlWrapperType: 'row',
            },
        },
        string: {
            type: JsonSchemaType.String,
            title: 'string sdjlaksdlj askljdlkasjd asjkldajsl;sadjklajsdklajsllll as',
            description: 'string description',
            entityParameters: {
                type: EntityType.String,
                controlType: 'base',
                controlWrapperType: 'row',
                controlWrapperProps: {
                    descriptionType: 'bottom',
                    required: true,
                },
            },
        },
        boolean: {
            type: JsonSchemaType.Boolean,
            title: 'boolean',
            description: 'boolean description',
            entityParameters: {
                type: EntityType.Boolean,
                controlType: 'base',
                controlWrapperType: 'row',
            },
        },
        switch: {
            type: JsonSchemaType.Boolean,
            title: 'switch',
            description: 'switch description',
            entityParameters: {
                type: EntityType.Boolean,
                controlType: 'switch',
                controlWrapperType: 'row',
            },
        },
        textarea: {
            type: JsonSchemaType.String,
            title: 'textarea',
            description: 'textarea description',
            entityParameters: {
                type: EntityType.String,
                controlType: 'textarea',
                controlWrapperType: 'row',
            },
        },
        alert: {
            type: JsonSchemaType.String,
            title: 'alert',
            description: 'alert description',
            entityParameters: {
                type: EntityType.String,
                controlType: 'alert',
                controlWrapperType: 'row',
                controlProps: {
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
            entityParameters: {
                type: EntityType.String,
                controlType: 'label',
                controlWrapperType: 'row',
                controlProps: {
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
            entityParameters: {
                type: EntityType.String,
                controlType: 'text_content',
                controlWrapperType: 'row',
                controlProps: {
                    iconName: 'TriangleExclamation',
                },
            },
        },
        password: {
            type: JsonSchemaType.String,
            title: 'password',
            description: 'password description',
            entityParameters: {
                type: EntityType.String,
                controlType: 'password',
                controlWrapperType: 'row',
            },
        },
        color_picker: {
            type: JsonSchemaType.String,
            default: '#5282ff',
            title: 'color_picker',
            description: 'color picker description',
            entityParameters: {
                type: EntityType.String,
                controlType: 'color_picker',
                controlWrapperType: 'row',
                controlProps: {
                    withAlpha: true,
                },
            },
        },
        date_input: {
            default: '2020-01-01',
            title: 'date_input',
            description: 'date input description',
            entityParameters: {
                type: EntityType.Any,
                controlType: 'date_input',
                controlWrapperType: 'row',
            },
        },
        radio_group: {
            type: JsonSchemaType.String,
            enum: ['foo', 'bar', 'rab'],
            default: 'foo',
            title: 'radio_group',
            description: 'radio group description',
            entityParameters: {
                type: EntityType.String,
                controlType: 'radio_group',
                controlWrapperType: 'row',
                controlProps: {
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
            entityParameters: {
                type: EntityType.String,
                controlType: 'segmented_radio_group',
                controlWrapperType: 'row',
                controlProps: {
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
            entityParameters: {
                type: EntityType.String,
                controlType: 'select',
                controlWrapperType: 'accordeon',
                controlProps: {
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
                    entityParameters: {
                        type: EntityType.String,
                        controlType: 'select',
                        controlWrapperType: 'accordeon',
                        controlProps: {
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
            entityParameters: {
                type: EntityType.Object,
                controlType: 'base',
                controlWrapperType: 'transparent',
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
            entityParameters: {
                type: EntityType.Array,
                controlType: 'checkbox_group',
                controlWrapperType: 'accordeon',
                controlProps: {
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
                    entityParameters: {
                        type: EntityType.Array,
                        controlType: 'checkbox_group',
                        controlWrapperType: 'accordeon',
                        controlProps: {
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
            entityParameters: {
                type: EntityType.Object,
                controlType: 'base',
                controlWrapperType: 'transparent',
            },
        },
        multi_select: {
            type: JsonSchemaType.Array,
            items: {enum: ['draft', 'published', 'archived']},
            default: ['draft'],
            examples: [['Choose status']],
            title: 'multi_select',
            entityParameters: {
                type: EntityType.Array,
                controlType: 'select',
                controlWrapperType: 'row',
                controlProps: {
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
            entityParameters: {
                type: EntityType.Number,
                controlType: 'slider',
                controlWrapperType: 'row',
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
            entityParameters: {
                type: EntityType.Object,
                controlType: 'range_slider',
                controlWrapperType: 'row',
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
                    entityParameters: {
                        type: EntityType.String,
                        controlType: 'base',
                        controlWrapperType: 'transparent',
                    },
                },
            },
            entityParameters: {
                type: EntityType.Object,
                controlType: 'dot_value',
                controlWrapperType: 'row',
            },
        },
        file: {
            type: JsonSchemaType.String,
            title: 'File Input',
            entityParameters: {
                type: EntityType.String,
                controlType: 'file',
                controlWrapperType: 'row',
                controlProps: {
                    accept: ['.json', '.txt'],
                    readAsMethod: 'readAsText',
                },
            },
        },
    },
    title: 'Main object',
    description: 'Main object description',
    entityParameters: {
        type: EntityType.Object,
        controlType: 'base',
        controlWrapperType: 'section',
        controlWrapperProps: {
            descriptionType: 'bottom',
            withIndent: true,
            variant: 'subheader-2',
        },
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

const template = () => {
    const Template: StoryFn<typeof ObjectBase> = (__) => (
        <Form initialValues={value} onSubmit={noop} mutators={{...schemaRendererMutators}}>
            {(form) => (
                <React.Fragment>
                    <SchemaRenderer
                        name="test"
                        schema={schema}
                        config={config}
                        mode={SchemaRendererMode.Form}
                    />

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

    return Template;
};

export const Base = template();
