import React from 'react';

import {Text} from '@gravity-ui/uikit';

import {type SchemaRendererSettings} from '../../../core';
import {DASH} from '../../constants';
import {EntityContainer} from '../EntityContainer';

export interface EmptyEntityValueProps {
    settings?: SchemaRendererSettings;
}

export const EmptyEntityValue: React.FC<EmptyEntityValueProps> = ({settings}) => {
    return (
        <EntityContainer width="fit" fill="empty">
            <Text variant={settings?.textVariant}>{DASH}</Text>
        </EntityContainer>
    );
};
