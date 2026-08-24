import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './LayoutContainer.scss';

const b = block('layout-container');

export interface LayoutContainerProps extends FlexProps {
    children: React.ReactNode;
}

const LayoutContainerComponent: React.FC<LayoutContainerProps> = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <Flex className={b(null, className)} direction="column" {...restProps}>
            {children}
        </Flex>
    );
};

export const LayoutContainer = React.memo(LayoutContainerComponent);
