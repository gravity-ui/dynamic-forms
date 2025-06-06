import React from 'react';

import {File} from '@gravity-ui/icons';
import {Icon, Text, type TextProps} from '@gravity-ui/uikit';

import {block} from '../../../utils';

import './MonacoHeader.scss';

const b = block('monaco-header');

interface MonacoHeaderProps {
    language: string;
    dialogButton?: React.ReactNode;
    headerIconSize: number;
    headerIconIndent: number;
    headerTitleVariant: TextProps['variant'];
}

export const MonacoHeader: React.FC<MonacoHeaderProps> = ({
    language,
    dialogButton,
    headerIconSize,
    headerIconIndent,
    headerTitleVariant,
}) => (
    <div className={b()}>
        <div className={b('title')}>
            <div style={{marginRight: `${headerIconIndent}px`}}>
                <Icon data={File} size={headerIconSize} />
            </div>
            <Text variant={headerTitleVariant}>{language}</Text>
        </div>
        {dialogButton ?? null}
    </div>
);
