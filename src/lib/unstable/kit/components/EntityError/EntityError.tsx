import React from 'react';

import {Text} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './EntityError.scss';

const b = block('entity-error');

export interface EntityErrorProps {
    errorMessage?: string;
    validationState?: 'invalid';
}

export const EntityError: React.FC<EntityErrorProps> = ({errorMessage, validationState}) => {
    if (validationState === 'invalid' && errorMessage) {
        return (
            <Text className={b()} color="danger">
                {errorMessage}
            </Text>
        );
    }

    return null;
};
