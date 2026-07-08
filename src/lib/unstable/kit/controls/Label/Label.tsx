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

export interface LabelProps extends UIKitLabelProps {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

const Component: Control<JsonSchemaString, LabelProps> = ({controlProps, input, schema}) => {
    const {value} = input;
    const {iconName, iconProps, title, ...controlRestProps} = controlProps;

    const icon = React.useMemo(
        () =>
            iconName && icons[iconName] ? (
                <Icon data={icons[iconName]} {...iconProps} />
            ) : undefined,
        [iconName, iconProps],
    );

    const content = React.useMemo(() => {
        if (title) {
            if (typeof title === 'string') {
                return <span dangerouslySetInnerHTML={{__html: title}} />;
            }

            return title;
        }

        if (schema.description) {
            return <span dangerouslySetInnerHTML={{__html: schema.description}} />;
        }

        return undefined;
    }, [title, schema.description]);

    return (
        <ControlContainer stretch="fit">
            <UIKitLabel size="m" value={value} icon={icon} {...controlRestProps}>
                {content}
            </UIKitLabel>
        </ControlContainer>
    );
};

export const Label = React.memo(Component);
