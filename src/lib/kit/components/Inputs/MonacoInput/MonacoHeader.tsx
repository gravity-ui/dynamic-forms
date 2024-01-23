import React from 'react';

import {File} from '@gravity-ui/icons';
import {Icon, Text} from '@gravity-ui/uikit';

import {block} from '../../../utils';

import './MonacoHeader.scss';

const b = block('monaco-header');

interface MonacoHeaderProps {
    language?: string;
    editButton?: React.ReactNode;
}

export const MonacoHeader: React.FC<MonacoHeaderProps> = ({language, editButton}) => (
    <div className={b()}>
        <div>
            <Icon data={File} size={18} />
            <Text variant="body-3">{language}</Text>
        </div>
        {editButton ?? null}
    </div>
);
