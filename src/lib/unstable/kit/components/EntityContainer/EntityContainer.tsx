import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './EntityContainer.scss';

const b = block('entity-container');

export interface EntityContainerProps extends FlexProps {
    children: React.ReactNode;
    fill?: 'populated' | 'empty' | 'by-child';
    stretch: 'max' | 'fit' | 'by-child';
}

export const EntityContainer: React.FC<EntityContainerProps> = ({
    children,
    fill,
    stretch,
    ...restFlexProps
}) => {
    return (
        <div className={b({stretch})} data-stretch={stretch} data-fill={fill}>
            <Flex direction="column" minWidth={0} {...restFlexProps} grow={1}>
                {children}
            </Flex>
        </div>
    );
};
