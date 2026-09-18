import {type TextProps} from '@gravity-ui/uikit';

export interface SchemaRendererSettings {
    coerceInitialValues: boolean;
    jsonDefaultValues: boolean;
    size: 's' | 'm' | 'l' | 'xl';
    headVariant: TextProps['variant'];
    titleVariant: TextProps['variant'];
    textVariant: TextProps['variant'];
}
