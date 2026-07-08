import React from 'react';

import * as icons from '@gravity-ui/icons';
import {
    Icon,
    type IconProps,
    Label as UIKitLabel,
    type LabelProps as UIKitLabelProps,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlContainer} from '../../components';
import {block} from '../../utils';

import './TextContent.scss';

const b = block('text-content');

export interface TextContentProps extends Omit<UIKitLabelProps, 'theme'> {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

const Component: Control<JsonSchemaString, TextContentProps> = ({controlProps, input, schema}) => {
    const {iconName, iconProps, title: titleProp, ...controlRestProps} = controlProps;

    const icon = React.useMemo(
        () =>
            iconName && icons[iconName] ? (
                <Icon data={icons[iconName]} {...iconProps} />
            ) : undefined,
        [iconName, iconProps],
    );

    const content = React.useMemo(() => {
        if (titleProp) {
            if (typeof titleProp === 'string') {
                return <span dangerouslySetInnerHTML={{__html: titleProp}} />;
            }

            return titleProp;
        }

        if (schema.description) {
            return <span dangerouslySetInnerHTML={{__html: schema.description}} />;
        }

        return undefined;
    }, [titleProp, schema.description]);

    return (
        <ControlContainer stretch="fit">
            <UIKitLabel
                size="m"
                value={input.value}
                icon={icon}
                {...controlRestProps}
                className={b(null, controlRestProps.className)}
                theme="clear"
            >
                {content}
            </UIKitLabel>
        </ControlContainer>
    );
};

export const TextContent = React.memo(Component);
