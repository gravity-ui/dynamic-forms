import React from 'react';

import {HelpMark as UIKitHelpMark} from '@gravity-ui/uikit';

import {type SchemaRendererSettings} from '../../../core';
import {HTMLContent} from '../../components';

export interface HelpMarkProps {
    className?: string;
    content: string;
    headName: string;
    settings?: SchemaRendererSettings;
}

export const HelpMark: React.FC<HelpMarkProps> = ({className, content, headName, settings}) => {
    return (
        <UIKitHelpMark className={className} iconSize={settings?.size}>
            <HTMLContent content={content} headName={headName} settings={settings} />
        </UIKitHelpMark>
    );
};
