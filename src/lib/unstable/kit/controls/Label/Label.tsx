import React from 'react';

import * as icons from '@gravity-ui/icons';
import {
    Label as GravityLabel,
    type LabelProps as GravityLabelProps,
    Icon,
    type IconProps,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';

export interface LabelProps extends GravityLabelProps {
    iconName?: keyof typeof icons;
    iconProps?: Partial<IconProps>;
}

const Component: Control<JsonSchemaString, LabelProps> = ({controlProps, input, schema}) => {
    const {iconName, iconProps, title: titleProp, ...controlRestProps} = controlProps;

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
        <GravityLabel size="m" value={input.value} icon={icon} {...controlRestProps}>
            {content}
        </GravityLabel>
    );
};

export const Label = React.memo(Component);
