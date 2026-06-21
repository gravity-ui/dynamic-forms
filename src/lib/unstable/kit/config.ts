import {EntityType} from '../core/constants';
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
    [EntityType.Any]: {
        controls: {
            baseAny: {Component: AnyInput},
        },
        views: {},
        wrappers: {},
        validators: {},
    },
    [EntityType.Array]: {
        controls: {selectArray: {Component: MultiSelect}, baseArray: {Component: ArrayBase}},
        views: {},
        wrappers: {accordeonArray: Accordeon, rowArray: Row},
        validators: {baseArray: (() => false) as SyncValidator<JsonSchemaArray>},
    },
    [EntityType.Boolean]: {
        controls: {},
        views: {},
        wrappers: {},
        validators: {baseBoolean: (() => false) as SyncValidator<JsonSchemaBoolean>},
    },
    [EntityType.Number]: {
        controls: {baseNumber: {Component: Text}},
        views: {},
        wrappers: {rowNumber: Row},
        validators: {
            baseNumber: () => false,
            asyncNumber: (() =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('bocembocembocem');
                    }, 2000);
                })) as AsyncValidator<JsonSchemaNumber>,
        },
    },
    [EntityType.Object]: {
        controls: {baseObject: {Component: ObjectBase, independent: true}},
        views: {},
        wrappers: {accordeonObject: Accordeon},
        validators: {baseObject: (() => false) as SyncValidator<JsonSchemaObject>},
    },
    [EntityType.String]: {
        controls: {baseString: {Component: Text}},
        views: {},
        wrappers: {rowString: Row},
        validators: {
            baseString: (() => 'jajaja') as SyncValidator<JsonSchemaString>,
            // async: (() =>
            //     new Promise((resolve) => {
            //         setTimeout(() => {
            //             resolve('bocembocembocem');
            //         }, 2000);
            //     })) as AsyncValidator<JsonSchemaString>,
            cccString: (() => 'ccc') as SyncValidator<JsonSchemaString>,
        },
    },
} as const;

export const config: SchemaRendererConfig = untypedConfig;
