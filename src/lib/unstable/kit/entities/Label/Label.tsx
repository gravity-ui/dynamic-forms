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
}) => {
    const {value} = input;
    const {iconName, iconProps, title, ...restEntityProps} = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

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
                return <HTMLContent content={title} headName={headName} />;
            }

            return title;
        }

        if (schema.description) {
            return <HTMLContent content={schema.description} headName={headName} />;
        }

        return undefined;
    }, [headName, title, schema.description]);

    return (
        <EntityContainer stretch="fit" fill="populated">
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
