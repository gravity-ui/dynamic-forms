import type {AlertProps, LabelProps} from '@gravity-ui/uikit';
import type {ColorTextBaseProps} from '@gravity-ui/uikit/build/esm/components/Text/colorText/colorText';

import type {ReadAsMethod, SpecTypes} from '../constants';

import type {ArrayValue, ObjectValue} from './';

export interface ArraySpec<
    LinkType = any,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> {
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
            description?: string;
        }[];
        link?: LinkType;
        placeholder?: string;
        addButtonPosition?: 'down' | 'right';
        hidden?: boolean;
        selectParams?: {
            filterPlaceholder?: string;
            meta?: Record<string, string>;
        };
        inputProps?: InputComponentProps;
        layoutProps?: LayoutComponentProps;
        checkboxGroupParams?: {
            placement?: 'horizontal' | 'vertical';
            disabled?: Record<string, boolean>;
        };
    };
}

export interface BooleanSpec<
    LinkType = any,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> {
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
        inputProps?: InputComponentProps;
        layoutProps?: LayoutComponentProps;
    };
}

export interface NumberSpec<
    LinkType = any,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> {
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
        inputProps?: InputComponentProps;
        layoutProps?: LayoutComponentProps;
    };
}

export interface ObjectSpec<
    LinkType = any,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> {
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
            toggler?: 'select' | 'radio' | 'card' | 'checkbox';
            booleanMap?: Record<'true' | 'false', string>;
        };
        placeholder?: string;
        hidden?: boolean;
        inputProps?: InputComponentProps;
        layoutProps?: LayoutComponentProps;
        delimiter?: Record<string, string>;
    };
}

export interface StringSpec<
    LinkType = any,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> {
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
            titleAlert?: string;
            themeAlert?: AlertProps['theme'];
            viewAlert?: AlertProps['view'];
        };
        fileInput?: {
            accept?: string;
            readAsMethod?: ReadAsMethod;
            ignoreText?: boolean;
        };
        dateInput?: {
            outputFormat?: string;
            printFormat?: string;
            timeZone?: string;
        };
        copy?: boolean;
        selectParams?: {
            filterPlaceholder?: string;
            meta?: Record<string, string>;
        };
        radioGroupParams?: {
            direction?: 'horizontal' | 'vertical';
            disabled?: Record<string, boolean>;
        };
        inputProps?: InputComponentProps;
        layoutProps?: LayoutComponentProps;
        generateRandomValueButton?: boolean;
    };
}

export type Spec<
    LinkType = any,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> =
    | ArraySpec<LinkType, InputComponentProps, LayoutComponentProps>
    | BooleanSpec<LinkType, InputComponentProps, LayoutComponentProps>
    | NumberSpec<LinkType, InputComponentProps, LayoutComponentProps>
    | ObjectSpec<LinkType, InputComponentProps, LayoutComponentProps>
    | StringSpec<LinkType, InputComponentProps, LayoutComponentProps>;
