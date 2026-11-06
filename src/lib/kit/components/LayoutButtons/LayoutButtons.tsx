import React from 'react';

import {ArrayRemoveButton} from '../ArrayRemoveButton';
import {CopyButton} from '../CopyButton';
import {DropButton} from '../DropButton';

export const LayoutButtons: React.FC = () => {
    return (
        <React.Fragment>
            <ArrayRemoveButton />
            <CopyButton />
            <DropButton />
        </React.Fragment>
    );
};
