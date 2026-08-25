import React from 'react';

import {DASH} from '../../constants';
import {EntityContainer} from '../EntityContainer';

const EmptyEntityValueComponent: React.FC = () => {
    return (
        <EntityContainer stretch="fit" fill="empty">
            {DASH}
        </EntityContainer>
    );
};

export const EmptyEntityValue = React.memo(EmptyEntityValueComponent);
