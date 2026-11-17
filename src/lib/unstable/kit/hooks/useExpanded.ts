import React from 'react';

import {SchemaRendererEventType, useSchemaRendererState} from '../../core';

export interface UseExpandedParams {
    headName: string;
    open?: boolean;
}

export const useExpanded = ({headName, open = true}: UseExpandedParams) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const srState = useSchemaRendererState({
        headName,
        subscriptions: [SchemaRendererEventType.Submit],
    });

    const [expanded, setExpanded] = React.useState(open);

    const toggleExpanded = React.useCallback(() => {
        setExpanded((f) => !f);
    }, []);

    React.useEffect(() => {
        if (
            srState &&
            srState.submitCount > 0 &&
            containerRef.current?.querySelector('[data-sr-error="true"]')
        ) {
            setExpanded(true);
        }
    }, [srState]);

    return {containerRef, expanded, setExpanded, toggleExpanded};
};
