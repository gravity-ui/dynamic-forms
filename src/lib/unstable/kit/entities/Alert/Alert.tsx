import React from 'react';

import * as icons from '@gravity-ui/icons';
import {
    Flex,
    Icon,
    type IconProps,
    Alert as UIKitAlert,
    type AlertProps as UIKitAlertProps,
} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer, HTMLContent} from '../../components';
import {block} from '../../utils';

import './Alert.scss';

const b = block('alert');

export interface AlertProps extends UIKitAlertProps {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

export const Alert: NodeEntity<JsonSchemaString, AlertProps> = ({headName, props, schema}) => {
    const {iconName, iconProps, message, title: titleProp, ...entityRestProps} = props;
    const {open = true} = schema.nodeParameters?.flags || {};

    const [expanded, setExpanded] = React.useState(open);

    const icon = React.useMemo(
        () =>
            iconName && icons[iconName] ? (
                <Icon data={icons[iconName]} {...iconProps} />
            ) : undefined,
        [iconName, iconProps],
    );

    const title = React.useMemo(() => {
        if (titleProp && typeof titleProp !== 'string') {
            return titleProp;
        }

        const title = typeof titleProp === 'string' ? titleProp : schema.title;

        if (title) {
            return (
                <Flex
                    className={b('title')}
                    alignItems="center"
                    gap="2"
                    onClick={() => setExpanded(!expanded)}
                >
                    <HTMLContent content={title} headName={headName} variant="subheader-2" />
                    <Icon data={expanded ? icons.ChevronUp : icons.ChevronDown} size={16} />
                </Flex>
            );
        }

        return null;
    }, [headName, schema.title, titleProp, expanded]);

    const msg = React.useMemo(() => {
        if (message) {
            if (typeof message === 'string') {
                return (
                    <div className={b('message', {expanded: expanded || !title})}>
                        <HTMLContent content={message} headName={headName} />
                    </div>
                );
            }

            return message;
        }

        if (schema.description) {
            return (
                <div className={b('message', {expanded: expanded || !title})}>
                    <HTMLContent content={schema.description} headName={headName} />
                </div>
            );
        }

        return undefined;
    }, [expanded, headName, message, schema.description, title]);

    return (
        <EntityContainer className={b({expanded})} stretch="fit" fill="populated">
            <UIKitAlert icon={icon} message={msg} title={title} {...entityRestProps} />
        </EntityContainer>
    );
};
