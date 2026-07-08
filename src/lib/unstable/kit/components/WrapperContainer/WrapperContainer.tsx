import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './WrapperContainer.scss';

const b = block('wrapper-container');

export interface WrapperContainerProps extends FlexProps {
    children: React.ReactNode;
}

const Component: React.FC<WrapperContainerProps> = ({className, children, ...restProps}) => {
    return (
        <Flex className={b(null, className)} direction="column" {...restProps}>
            {children}
        </Flex>
    );
};

export const WrapperContainer = React.memo(Component);
