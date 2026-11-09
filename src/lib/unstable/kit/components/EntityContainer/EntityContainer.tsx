import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {useSchemaRendererNodeContext} from '../../../core';
import {block} from '../../utils';

import './EntityContainer.scss';

const b = block('entity-container');

export interface EntityContainerProps extends FlexProps {
    children: React.ReactNode;
    droppable?: boolean;
    fill?: 'populated' | 'empty' | 'by-child';
    ref?: React.ComponentPropsWithRef<'div'>['ref'];
    width: 'max' | 'fit' | 'by-child';
}

export const EntityContainer: React.FC<EntityContainerProps> = ({
    children,
    droppable,
    fill,
    width,
    ...restFlexProps
}) => {
    const {settings} = useSchemaRendererNodeContext();

    return (
        <div
            className={b({view: settings?.view ?? 'stretch'})}
            data-fill={fill}
            data-droppable={droppable}
            data-width={width}
        >
            <Flex direction="column" minWidth={0} {...restFlexProps} grow={1}>
                {children}
            </Flex>
        </div>
    );
};
