import React from 'react';

import {Text, type TextProps} from '@gravity-ui/uikit';

import {
    SchemaRendererEventType,
    useSchemaRendererNodeContext,
    useSchemaRendererState,
} from '../../../core';

export interface HTMLContentProps extends TextProps {
    content: string;
}

export const HTMLContent: React.FC<HTMLContentProps> = ({content, ...restProps}) => {
    const {headName, settings} = useSchemaRendererNodeContext();

    const state = useSchemaRendererState({
        headName,
        subscriptions: [SchemaRendererEventType.UserContext],
    });

    const RenderHTMLOrMD = state?.userContext?.RenderHTMLOrMD;

    if (RenderHTMLOrMD) {
        return <RenderHTMLOrMD content={content} />;
    }

    return (
        <Text
            variant={settings?.textVariant}
            {...restProps}
            dangerouslySetInnerHTML={{__html: content}}
        />
    );
};
