import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './EntityContainer.scss';

const b = block('entity-container');

export interface EntityContainerProps extends FlexProps {
    stretch: 'max' | 'fit' | 'by-child';
    children: React.ReactNode;
}

const EntityContainerComponent: React.FC<EntityContainerProps> = ({
    stretch,
    children,
    ...restFlexProps
}) => {
    return (
        <div className={b({stretch})} data-stretch={stretch}>
            <Flex direction="column" {...restFlexProps} grow={1}>
                {children}
            </Flex>
        </div>
    );
};

export const EntityContainer = React.memo(EntityContainerComponent);
