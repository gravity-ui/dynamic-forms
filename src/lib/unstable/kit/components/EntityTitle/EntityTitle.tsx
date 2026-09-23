import React from 'react';

import {Text, type TextProps} from '@gravity-ui/uikit';

import {SchemaRendererMode, useSchemaRendererNodeContext} from '../../../core';
import {block} from '../../utils';

import './EntityTitle.scss';

const b = block('entity-title');

export interface EntityTitleProps extends TextProps {
    className?: string;
    type?: 'head' | 'title';
}

export const EntityTitle: React.FC<EntityTitleProps> = ({className, type, ...restProps}) => {
    const {mode, schema, settings} = useSchemaRendererNodeContext();

    const overviewFlag = mode === SchemaRendererMode.Overview;
    const {required} = schema.nodeParameters?.flags || {};

    if (!schema.title) {
        return null;
    }

    return (
        <Text
            variant={type === 'head' ? settings?.headVariant : settings?.titleVariant}
            color="complementary"
            wordBreak="break-word"
            whiteSpace="break-spaces"
            {...restProps}
            className={b({required: required && !overviewFlag}, className)}
        >
            {schema.title}
        </Text>
    );
};
