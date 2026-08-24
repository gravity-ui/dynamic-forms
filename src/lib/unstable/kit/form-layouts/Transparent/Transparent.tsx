import React from 'react';

import {Flex} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {ArrayRemoveButton, EntityError, LayoutContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './Transparent.scss';

const b = block('transparent');

const Component: NodeLayout<JsonSchema> = ({children, headName, input, meta}) => {
    return (
        <LayoutContainer className={b()} gap={0.5}>
            <Flex grow={1} gap={2}>
                {children}
                <ArrayRemoveButton name={input.name} headName={headName} />
            </Flex>
            <EntityError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </LayoutContainer>
    );
};

export const Transparent = React.memo(Component);
