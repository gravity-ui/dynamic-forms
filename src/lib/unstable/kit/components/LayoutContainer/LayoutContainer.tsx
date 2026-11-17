import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {useSchemaRendererNodeContext} from '../../../core';
import {block} from '../../utils';

import './LayoutContainer.scss';

const b = block('layout-container');

export interface LayoutContainerProps extends FlexProps {
    children: React.ReactNode;
    containerRef?: React.RefObject<HTMLDivElement | null>;
    hideEmpty?: boolean;
    hidden?: boolean;
}

export const LayoutContainer: React.FC<LayoutContainerProps> = ({
    className,
    children,
    containerRef,
    hideEmpty = false,
    hidden = false,
    ...restProps
}) => {
    const {settings} = useSchemaRendererNodeContext();

    return (
        <Flex
            ref={containerRef}
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
