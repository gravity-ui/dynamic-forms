import React from 'react';

import {Flex, Text} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './ControlError.scss';

const b = block('control-error');

export interface ControlErrorProps {
    className?: string;
    errorMessage?: string;
    validationState?: 'invalid';
    children: React.ReactNode;
}

export const ControlError: React.FC<ControlErrorProps> = ({
    className,
    errorMessage,
    validationState,
    children,
}) => {
    const error =
        validationState === 'invalid' && errorMessage ? (
            <Text color="danger">{errorMessage}</Text>
        ) : null;

    return (
        <Flex
            className={b(null, className)}
            width="100%"
            direction="column"
            alignItems="flex-start"
        >
            <div className={b('children', {errors: Boolean(error)})}>{children}</div>
            {error}
        </Flex>
    );
};
