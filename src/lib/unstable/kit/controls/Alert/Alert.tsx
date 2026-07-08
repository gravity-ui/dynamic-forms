import React from 'react';

import * as icons from '@gravity-ui/icons';
import {
    Icon,
    type IconProps,
    Alert as UIKitAlert,
    type AlertProps as UIKitAlertProps,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlContainer} from '../../components';

export interface AlertProps extends UIKitAlertProps {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

const Component: Control<JsonSchemaString, AlertProps> = ({controlProps, schema}) => {
    const {iconName, iconProps, message, ...controlRestProps} = controlProps;

    const icon = React.useMemo(
        () =>
            iconName && icons[iconName] ? (
                <Icon data={icons[iconName]} {...iconProps} />
            ) : undefined,
        [iconName, iconProps],
    );

    const msg = React.useMemo(() => {
        if (message) {
            if (typeof message === 'string') {
                return <span dangerouslySetInnerHTML={{__html: message}} />;
            }

            return message;
        }

        if (schema.description) {
            return <span dangerouslySetInnerHTML={{__html: schema.description}} />;
        }

        return undefined;
    }, [message, schema.description]);

    return (
        <ControlContainer stretch="fit">
            <UIKitAlert icon={icon} message={msg} {...controlRestProps} />
        </ControlContainer>
    );
};

export const Alert = React.memo(Component);
