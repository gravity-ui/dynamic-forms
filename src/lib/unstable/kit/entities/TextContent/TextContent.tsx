import React from 'react';

import * as icons from '@gravity-ui/icons';
import {
    Icon,
    type IconProps,
    Text,
    Label as UIKitLabel,
    type LabelProps as UIKitLabelProps,
} from '@gravity-ui/uikit';

import {type JsonSchemaString, type NodeEntity, SchemaRendererMode} from '../../../core';
import {EntityContainer, HTMLContent} from '../../components';
import {block} from '../../utils';

import './TextContent.scss';

const b = block('text-content');

export interface TextContentProps extends Omit<UIKitLabelProps, 'theme'> {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

export const TextContent: NodeEntity<JsonSchemaString, TextContentProps> = ({
    headName,
    input,
    mode,
    props,
    schema,
    settings,
}) => {
    const {className, iconName, iconProps, title: titleProp, ...restEntityProps} = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const value = React.useMemo(() => {
        if (input.value) {
            return <Text variant={settings?.textVariant}>{input.value}</Text>;
        }

        return input.value;
    }, [input.value, settings?.textVariant]);

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
                return <HTMLContent content={titleProp} headName={headName} settings={settings} />;
            }

            return titleProp;
        }

        if (schema.description) {
            return (
                <HTMLContent content={schema.description} headName={headName} settings={settings} />
            );
        }

        return undefined;
    }, [headName, titleProp, schema.description, settings]);

    return (
        <EntityContainer
            className={b({size: settings?.size})}
            justifyContent="center"
            stretch="fit"
            fill="populated"
        >
            <UIKitLabel
                size={overviewFlag ? 'xs' : 'm'}
                value={value}
                icon={icon}
                className={b(null, className)}
                {...restEntityProps}
                theme="clear"
            >
                {content}
            </UIKitLabel>
        </EntityContainer>
    );
};
