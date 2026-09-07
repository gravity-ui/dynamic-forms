import React from 'react';

import * as icons from '@gravity-ui/icons';
import {
    Icon,
    type IconProps,
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
}) => {
    const {className, iconName, iconProps, title: titleProp, ...restEntityProps} = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

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
                return <HTMLContent content={titleProp} headName={headName} />;
            }

            return titleProp;
        }

        if (schema.description) {
            return <HTMLContent content={schema.description} headName={headName} />;
        }

        return undefined;
    }, [headName, titleProp, schema.description]);

    return (
        <EntityContainer stretch="fit" fill="populated">
            <UIKitLabel
                size={overviewFlag ? 'xs' : 'm'}
                value={input.value}
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
