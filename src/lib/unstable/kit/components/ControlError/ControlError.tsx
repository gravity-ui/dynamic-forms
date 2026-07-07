import React from 'react';

import {Text} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './ControlError.scss';

const b = block('control-error');

export interface ControlErrorProps {
    errorMessage?: string;
    validationState?: 'invalid';
}

export const ControlError: React.FC<ControlErrorProps> = ({errorMessage, validationState}) => {
    if (validationState === 'invalid' && errorMessage) {
        return (
            <Text className={b()} color="danger">
                {errorMessage}
            </Text>
        );
    }

    return null;
};
