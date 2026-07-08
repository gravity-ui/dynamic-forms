import React from 'react';

import {Flex} from '@gravity-ui/uikit';

import type {JsonSchema, Wrapper} from '../../../core';
import {ArrayRemoveButton, ControlError, WrapperContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './Transparent.scss';

const b = block('transparent');

const Component: Wrapper<JsonSchema> = ({children, input, meta}) => {
    return (
        <WrapperContainer className={b()} gap={0.5}>
            <Flex grow={1} gap={2}>
                {children}
                <ArrayRemoveButton name={input.name} />
            </Flex>
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </WrapperContainer>
    );
};

export const Transparent = React.memo(Component);
