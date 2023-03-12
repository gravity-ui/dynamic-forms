import {LabelProps} from '@gravity-ui/uikit';

import {SpecTypes} from '../constants';

import {ArrayValue, ObjectValue} from './';

export interface ArraySpec<LinkType = any> {
    defaultValue?: ArrayValue;
    type: SpecTypes.Array;
    required?: boolean;
    maxLength?: bigint;
    minLength?: bigint;
    items?: Spec;
    enum?: string[];
    description?: Record<string, string>;
    validator?: string;
    viewSpec: {
        disabled?: boolean;
        type: string;
        layout?: string;
        layoutTitle?: string;
        layoutDescription?: string;
        layoutOpen?: boolean;
        itemLabel?: string;
        table?: {
            label: string;
            property: string;
        }[];
        link?: LinkType;
        placeholder?: string;
    };
}

export interface BooleanSpec<LinkType = any> {
    defaultValue?: boolean;
    type: SpecTypes.Boolean;
    required?: boolean;
    validator?: string;
    viewSpec: {
        disabled?: boolean;
        type: string;
        layout?: string;
        layoutTitle?: string;
        layoutDescription?: string;
        layoutOpen?: boolean;
        link?: LinkType;
    };
}

export interface NumberSpec<LinkType = any> {
    defaultValue?: number;
    type: SpecTypes.Number;
    required?: boolean;
    maximum?: number;
    minimum?: number;
    format?: 'float' | 'int64';
    validator?: string;
    viewSpec: {
        disabled?: boolean;
        type: string;
        layout?: string;
        layoutTitle?: string;
        layoutDescription?: string;
        layoutOpen?: boolean;
        link?: LinkType;
        placeholder?: string;
    };
}

export interface ObjectSpec<LinkType = any> {
    defaultValue?: ObjectValue;
    type: SpecTypes.Object;
    required?: boolean;
    properties?: Record<string, Spec>;
    description?: Record<string, string>;
    validator?: string;
    viewSpec: {
        disabled?: boolean;
        type: string;
        layout?: string;
        layoutTitle?: string;
        layoutDescription?: string;
        layoutOpen?: boolean;
        order?: string[];
        link?: LinkType;
        showOptional?: boolean;
    };
}

export interface StringSpec<LinkType = any> {
    defaultValue?: string;
    type: SpecTypes.String;
    required?: boolean;
    maxLength?: bigint;
    minLength?: bigint;
    pattern?: string;
    patternError?: string;
    enum?: string[];
    description?: Record<string, string>;
    validator?: string;
    viewSpec: {
        disabled?: boolean;
        type: string;
        layout?: string;
        layoutTitle?: string;
        layoutDescription?: string;
        layoutOpen?: boolean;
        link?: LinkType;
        sizeParams?: {
            defaultType: string;
            scale: Record<string, {factor: string; title: string}>;
            viewType?: string;
        };
        monacoParams?: {
            language?: string;
            fontSize?: number;
        };
        hideValues?: string[];
        placeholder?: string;
        themeLabel?: LabelProps['theme'];
    };
}

export type Spec = ArraySpec | BooleanSpec | NumberSpec | ObjectSpec | StringSpec;
