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

import './Label.scss';

const b = block('label');

export interface LabelProps extends UIKitLabelProps {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

export const Label: NodeEntity<JsonSchemaString, LabelProps> = ({
    headName,
    input,
    mode,
    props,
    schema,
    settings,
}) => {
    const {value: inputValue} = input;
    const {iconName, iconProps, title, ...restEntityProps} = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const icon = React.useMemo(
        () =>
            iconName && icons[iconName] ? (
                <Icon data={icons[iconName]} {...iconProps} />
            ) : undefined,
        [iconName, iconProps],
    );

    const value = React.useMemo(() => {
        if (inputValue) {
            return <Text variant={settings?.textVariant}>{inputValue}</Text>;
        }

        return inputValue;
    }, [inputValue, settings?.textVariant]);

    const content = React.useMemo(() => {
        if (title) {
            if (typeof title === 'string') {
                return <HTMLContent content={title} headName={headName} settings={settings} />;
            }

            return title;
        }

        if (schema.description) {
            return (
                <HTMLContent content={schema.description} headName={headName} settings={settings} />
            );
        }

        return undefined;
    }, [headName, title, schema.description, settings]);

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
                {...restEntityProps}
            >
                {content}
            </UIKitLabel>
        </EntityContainer>
    );
};
