import React from 'react';

import {Flex} from '@gravity-ui/uikit';
import isBoolean from 'lodash/isBoolean';

import {type JsonSchema, type NodeLayout, SchemaRendererMode} from '../../../core';
import {EntityError, LayoutButtons, LayoutContainer} from '../../components';
import {block} from '../../utils';

import './Transparent.scss';

const b = block('transparent');

export interface TransparentProps {
    hideEmpty?: boolean;
}

export const Transparent: NodeLayout<JsonSchema, TransparentProps> = ({
    children,
    mode,
    props,
    schema,
}) => {
    const {hidden} = schema.nodeParameters?.flags || {};
    const overviewFlag = mode === SchemaRendererMode.Overview;

    return (
        <LayoutContainer
            className={b()}
            gap="spacing-half"
            hideEmpty={isBoolean(props.hideEmpty) ? props.hideEmpty : overviewFlag}
            hidden={hidden}
        >
            <Flex gap="spacing-2">
                {children}
                <LayoutButtons />
            </Flex>
            {overviewFlag ? null : <EntityError />}
        </LayoutContainer>
    );
};
