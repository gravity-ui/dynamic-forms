import React from 'react';

import {Flex, type FlexProps} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './ControlContainer.scss';

const b = block('control-container');

export interface ControlContainerProps extends FlexProps {
    stretch: 'max' | 'fit' | 'by-child';
    children: React.ReactNode;
}

const Component: React.FC<ControlContainerProps> = ({stretch, children, ...restFlexProps}) => {
    return (
        <div className={b({stretch})} data-stretch={stretch}>
            <Flex direction="column" {...restFlexProps} grow={1}>
                {children}
            </Flex>
        </div>
    );
};

export const ControlContainer = React.memo(Component);
