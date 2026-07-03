import React from 'react';

import * as icons from '@gravity-ui/icons';
import {
    Alert as GravityAlert,
    type AlertProps as GravityAlertProps,
    Icon,
    type IconProps,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';

export interface AlertProps extends GravityAlertProps {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

const Component: Control<JsonSchemaString, AlertProps> = ({controlProps, schema}) => {
    const {iconName, iconProps, message: messageProp, ...controlRestProps} = controlProps;

    const icon = React.useMemo(
        () =>
            iconName && icons[iconName] ? (
                <Icon data={icons[iconName]} {...iconProps} />
            ) : undefined,
        [iconName, iconProps],
    );

    const message = React.useMemo(() => {
        if (messageProp) {
            if (typeof messageProp === 'string') {
                return <span dangerouslySetInnerHTML={{__html: messageProp}} />;
            }

            return messageProp;
        }

        if (schema.description) {
            return <span dangerouslySetInnerHTML={{__html: schema.description}} />;
        }

        return undefined;
    }, [messageProp, schema.description]);

    return <GravityAlert icon={icon} message={message} {...controlRestProps} />;
};

export const Alert = React.memo(Component);
