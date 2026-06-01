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
import {AnyInput} from './Any';
import {ArrayBase} from './ArrayBase';
import {MultiSelect} from './MultiSelect';
import {ObjectBase} from './ObjectBase';
import {Row} from './Row';
import {Text} from './Text';

export const untypedConfig = {
    [JsonSchemaType.Any]: {
        controls: {
            base: {Component: AnyInput},
        },
        views: {},
        wrappers: {},
        validators: {},
    },
    [JsonSchemaType.Array]: {
        controls: {select: {Component: MultiSelect}, base: {Component: ArrayBase}},
        views: {},
        wrappers: {accordeon: Accordeon, row: Row},
        validators: {base: (() => false) as SyncValidator<JsonSchemaArray>},
    },
    [JsonSchemaType.Boolean]: {
        controls: {},
        views: {},
        wrappers: {},
        validators: {base: (() => false) as SyncValidator<JsonSchemaBoolean>},
    },
    [JsonSchemaType.Number]: {
        controls: {base: {Component: Text}},
        views: {},
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
        controls: {base: {Component: ObjectBase, independent: true}},
        views: {},
        wrappers: {accordeon: Accordeon},
        validators: {base: (() => false) as SyncValidator<JsonSchemaObject>},
    },
    [JsonSchemaType.String]: {
        controls: {base: {Component: Text}},
        views: {},
        wrappers: {row: Row},
        validators: {
            base: (() => 'jajaja') as SyncValidator<JsonSchemaString>,
            // async: (() =>
            //     new Promise((resolve) => {
            //         setTimeout(() => {
            //             resolve('bocembocembocem');
            //         }, 2000);
            //     })) as AsyncValidator<JsonSchemaString>,
            ccc: (() => 'ccc') as SyncValidator<JsonSchemaString>,
        },
    },
} as const;

export const config: SchemaRendererConfig = untypedConfig;
