import React from 'react';

import * as icons from '@gravity-ui/icons';
import {
    Icon,
    type IconProps,
    Alert as UIKitAlert,
    type AlertProps as UIKitAlertProps,
} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';

export interface AlertProps extends UIKitAlertProps {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

const AlertComponent: NodeEntity<JsonSchemaString, AlertProps> = ({props, schema}) => {
    const {iconName, iconProps, message, ...entityRestProps} = props;

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
        <EntityContainer stretch="fit">
            <UIKitAlert icon={icon} message={msg} {...entityRestProps} />
        </EntityContainer>
    );
};

export const Alert = React.memo(AlertComponent);
