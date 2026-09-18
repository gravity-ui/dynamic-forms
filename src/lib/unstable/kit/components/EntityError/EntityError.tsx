import React from 'react';

import {Text} from '@gravity-ui/uikit';

import {type SchemaRendererSettings} from '../../../core';
import {block} from '../../utils';

import './EntityError.scss';

const b = block('entity-error');

export interface EntityErrorProps {
    errorMessage?: string;
    settings?: SchemaRendererSettings;
    validationState?: 'invalid';
}

export const EntityError: React.FC<EntityErrorProps> = ({
    errorMessage,
    settings,
    validationState,
}) => {
    if (validationState === 'invalid' && errorMessage) {
        return (
            <Text
                className={b()}
                variant={settings?.textVariant}
                color="danger"
                wordBreak="break-word"
                data-sr-error="true"
            >
                {errorMessage}
            </Text>
        );
    }

    return null;
};
