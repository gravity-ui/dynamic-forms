import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './EntityContainer.scss';

const b = block('entity-container');

export interface EntityContainerProps extends FlexProps {
    children: React.ReactNode;
    droppable?: boolean;
    fill?: 'populated' | 'empty' | 'by-child';
    ref?: React.ComponentPropsWithRef<'div'>['ref'];
    stretch: 'max' | 'fit' | 'by-child';
}

export const EntityContainer: React.FC<EntityContainerProps> = ({
    children,
    droppable,
    fill,
    stretch,
    ...restFlexProps
}) => {
    return (
        <div
            className={b({stretch})}
            data-fill={fill}
            data-droppable={droppable}
            data-stretch={stretch}
        >
            <Flex direction="column" minWidth={0} {...restFlexProps} grow={1}>
                {children}
            </Flex>
        </div>
    );
};
