import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './LayoutContainer.scss';

const b = block('layout-container');

export interface LayoutContainerProps extends FlexProps {
    children: React.ReactNode;
    hideEmpty?: boolean;
}

export const LayoutContainer: React.FC<LayoutContainerProps> = ({
    className,
    children,
    hideEmpty = false,
    ...restProps
}) => {
    return (
        <Flex className={b({'hide-empty': hideEmpty}, className)} direction="column" {...restProps}>
            {children}
        </Flex>
    );
};
