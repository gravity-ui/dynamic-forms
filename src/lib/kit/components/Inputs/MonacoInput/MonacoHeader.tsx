import React from 'react';

import {File} from '@gravity-ui/icons';
import {Icon} from '@gravity-ui/uikit';

import {block} from '../../../utils';

import './MonacoHeader.scss';

const b = block('monaco-header');

interface MonacoHeaderProps {
    language?: string;
    editButton?: React.ReactNode;
    card?: boolean | undefined;
}

export const MonacoHeader: React.FC<MonacoHeaderProps> = ({language, editButton, card}) => (
    <div className={b({card})}>
        <div>
            <Icon data={File} size={18} />
            <span className={b('language')}>{language}</span>
        </div>
        {editButton ?? null}
    </div>
);
