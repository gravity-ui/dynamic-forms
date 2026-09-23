import React from 'react';

import {HelpMark} from '@gravity-ui/uikit';

import {useSchemaRendererNodeContext} from '../../../core';
import {HTMLContent} from '../../components';

export interface EntityDescriptionProps {
    content?: string;
    className?: string;
    likeHelpMark?: boolean;
}

export const EntityDescription: React.FC<EntityDescriptionProps> = ({
    content: contentProps,
    className,
    likeHelpMark,
}) => {
    const {schema, settings} = useSchemaRendererNodeContext();

    const content = contentProps || schema.description;

    if (!content) {
        return null;
    }

    if (likeHelpMark) {
        return (
            <HelpMark className={className} iconSize={settings?.size === 'xl' ? 'l' : 'm'}>
                <HTMLContent content={content} />
            </HelpMark>
        );
    }

    return <HTMLContent content={content} color="secondary" />;
};
