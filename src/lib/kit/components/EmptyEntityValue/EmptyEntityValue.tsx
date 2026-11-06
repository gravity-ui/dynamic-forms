import React from 'react';

import {Text} from '@gravity-ui/uikit';

import {useSchemaRendererNodeContext} from '../../../core';
import {DASH} from '../../constants';
import {EntityContainer} from '../EntityContainer';

export const EmptyEntityValue: React.FC = () => {
    const {settings} = useSchemaRendererNodeContext();

    return (
        <EntityContainer width="fit" fill="empty">
            <Text variant={settings?.textVariant}>{DASH}</Text>
        </EntityContainer>
    );
};
