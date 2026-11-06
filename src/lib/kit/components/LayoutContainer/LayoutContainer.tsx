import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {useSchemaRendererNodeContext} from '../../../core';
import {block} from '../../utils';

import './LayoutContainer.scss';

const b = block('layout-container');

export interface LayoutContainerProps extends FlexProps {
    children: React.ReactNode;
    hideEmpty?: boolean;
    hidden?: boolean;
}

export const LayoutContainer: React.FC<LayoutContainerProps> = ({
    className,
    children,
    hideEmpty = false,
    hidden = false,
    ...restProps
}) => {
    const {settings} = useSchemaRendererNodeContext();

    return (
        <Flex
            className={b(
                {'hide-empty': hideEmpty, hidden, view: settings?.view ?? 'stretch'},
                className,
            )}
            direction="column"
            {...restProps}
        >
            {children}
        </Flex>
    );
};
