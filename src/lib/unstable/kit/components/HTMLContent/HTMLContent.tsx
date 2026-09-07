import React from 'react';

import {Text, type TextProps} from '@gravity-ui/uikit';

import {SchemaRendererEventType, useSchemaRendererState} from '../../../core';

export interface HTMLContentProps extends TextProps {
    content: string;
    headName?: string;
}

export const HTMLContent: React.FC<HTMLContentProps> = ({
    content,
    headName = '___stub-name',
    ...restProps
}) => {
    const state = useSchemaRendererState({
        headName,
        subscriptions: [SchemaRendererEventType.UserContext],
    });

    const RenderHTMLOrMD = state?.userContext?.RenderHTMLOrMD;

    if (RenderHTMLOrMD) {
        return <RenderHTMLOrMD content={content} />;
    }

    return <Text {...restProps} dangerouslySetInnerHTML={{__html: content}} />;
};
