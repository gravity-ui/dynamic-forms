import {LabelProps} from '@gravity-ui/uikit';
import {ColorTextBaseProps} from '@gravity-ui/uikit/build/esm/components/Text/colorText/colorText';

import {ReadAsMethod, SpecTypes} from '../constants';

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
        itemPrefix?: string;
        table?: {
            label: string;
            property: string;
        }[];
        link?: LinkType;
        placeholder?: string;
        addButtonPosition?: 'down' | 'right';
        hidden?: boolean;
        selectParams?: {
            filterPlaceholder?: string;
            meta?: Record<string, string>;
        };
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
        hidden?: boolean;
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
        copy?: boolean;
        hidden?: boolean;
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
        oneOfParams?: {
            toggler?: 'select' | 'radio' | 'card';
        };
        placeholder?: string;
        hidden?: boolean;
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
        hidden?: boolean;
        textContentParams?: {
            themeLabel?: LabelProps['theme'];
            text: string;
            icon?: string;
            iconColor?: ColorTextBaseProps['color'];
        };
        fileInput?: {
            accept?: string;
            readAsMethod?: ReadAsMethod;
            ignoreText?: boolean;
        };
        copy?: boolean;
        selectParams?: {
            filterPlaceholder?: string;
            meta?: Record<string, string>;
        };
        showGenerateRandomValueButton?: boolean;
    };
}

export type Spec = ArraySpec | BooleanSpec | NumberSpec | ObjectSpec | StringSpec;
