import React from 'react';

import {Flex} from '@gravity-ui/uikit';

import type {JsonSchema, Wrapper} from '../../../core';
import {ArrayRemoveButton} from '../../components';
import {block} from '../../utils';

import './Transparent.scss';

const b = block('transparent');

const Component: Wrapper<JsonSchema> = ({children, input}) => {
    return (
        <Flex className={b()} gap={2}>
            {children}
            <ArrayRemoveButton name={input.name} />
        </Flex>
    );
};

export const Transparent = React.memo(Component);
