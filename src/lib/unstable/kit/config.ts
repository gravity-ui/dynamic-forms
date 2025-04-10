import {JsonSchemaType} from '../core/constants';
import type {AsyncValidator, SchemaRendererConfig, SyncValidator} from '../core/types';
import type {
    JsonSchemaArray,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from '../core/types/schema';

import {Accordeon} from './Accordeon';
import {ArrayBase} from './ArrayBase';
import {MultiSelect} from './MultiSelect';
import {ObjectBase} from './ObjectBase';
import {Row} from './Row';
import {Text} from './Text';

export const untypedConfig = {
    [JsonSchemaType.Array]: {
        views: {
            select: {
                form: {
                    Component: MultiSelect,
                },
                overview: {
                    Component: null,
                },
            },
            base: {
                form: {
                    Component: ArrayBase,
                },
                overview: {
                    Component: null,
                },
            },
        },
        wrappers: {accordeon: Accordeon, row: Row},
        validators: {base: (() => false) as SyncValidator<JsonSchemaArray>},
    },
    [JsonSchemaType.Boolean]: {
        views: {},
        wrappers: {},
        validators: {base: (() => false) as SyncValidator<JsonSchemaBoolean>},
    },
    [JsonSchemaType.Number]: {
        views: {
            base: {
                form: {
                    Component: Text,
                },
                overview: {
                    Component: null,
                },
            },
        },
        wrappers: {row: Row},
        validators: {
            base: () => false,
            async: (() =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('bocembocembocem');
                    }, 2000);
                })) as AsyncValidator<JsonSchemaNumber>,
        },
    },
    [JsonSchemaType.Object]: {
        views: {
            base: {
                form: {
                    Component: ObjectBase,
                    independent: true,
                },
                overview: {
                    Component: null,
                },
            },
        },
        wrappers: {accordeon: Accordeon},
        validators: {base: (() => false) as SyncValidator<JsonSchemaObject>},
    },
    [JsonSchemaType.String]: {
        views: {
            base: {
                form: {
                    Component: Text,
                },
                overview: {
                    Component: null,
                },
            },
        },
        wrappers: {row: Row},
        validators: {
            base: (() => 'jajaja') as SyncValidator<JsonSchemaString>,
            async: (() =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('bocembocembocem');
                    }, 2000);
                })) as AsyncValidator<JsonSchemaString>,
        },
    },
} as const;

export const config: SchemaRendererConfig = untypedConfig;
