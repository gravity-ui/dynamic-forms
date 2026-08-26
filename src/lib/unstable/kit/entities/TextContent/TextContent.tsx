import React from 'react';

import * as icons from '@gravity-ui/icons';
import {
    Icon,
    type IconProps,
    Label as UIKitLabel,
    type LabelProps as UIKitLabelProps,
} from '@gravity-ui/uikit';

import {type JsonSchemaString, type NodeEntity, SchemaRendererMode} from '../../../core';
import {EntityContainer} from '../../components';
import {block} from '../../utils';

import './TextContent.scss';

const b = block('text-content');

export interface TextContentProps extends Omit<UIKitLabelProps, 'theme'> {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

export const TextContent: NodeEntity<JsonSchemaString, TextContentProps> = ({
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
