import React from 'react';

import {Flex} from '@gravity-ui/uikit';
import isBoolean from 'lodash/isBoolean';

import {type JsonSchema, type NodeLayout, SchemaRendererMode} from '../../../core';
import {EntityError, LayoutButtons, LayoutContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './Transparent.scss';

const b = block('transparent');

export interface TransparentProps {
    hideEmpty?: boolean;
}

export const Transparent: NodeLayout<JsonSchema, TransparentProps> = ({
    children,
    headName,
    input,
    meta,
    mode,
    props,
    schema,
    settings,
}) => {
    const {hidden} = schema.nodeParameters?.flags || {};
    const overviewFlag = mode === SchemaRendererMode.Overview;

    return (
        <LayoutContainer
            className={b()}
            gap={0.5}
            hideEmpty={isBoolean(props.hideEmpty) ? props.hideEmpty : overviewFlag}
            hidden={hidden}
        >
            <Flex gap={2}>
                {children}
                <LayoutButtons
                    mode={mode}
                    name={input.name}
                    headName={headName}
                    schema={schema}
                    settings={settings}
                    value={input.value}
                />
            </Flex>
            {overviewFlag ? null : (
                <EntityError
                    errorMessage={meta.error}
                    settings={settings}
                    validationState={getValidationState(meta)}
                />
            )}
        </LayoutContainer>
    );
};
