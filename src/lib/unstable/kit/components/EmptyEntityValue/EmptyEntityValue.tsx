import React from 'react';

import {DASH} from '../../constants';
import {EntityContainer} from '../EntityContainer';

export const EmptyEntityValue: React.FC = () => {
    return (
        <EntityContainer stretch="fit" fill="empty">
            {DASH}
        </EntityContainer>
    );
};
