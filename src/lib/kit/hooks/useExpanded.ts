import React from 'react';

import {SchemaRendererEventType, useSchemaRendererState} from '../../core';

export interface UseExpandedParams {
    headName: string;
    name: string;
    open?: boolean;
}

export const useExpanded = ({headName, name, open = true}: UseExpandedParams) => {
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
            Object.keys(srState.errors).some((key) => key.startsWith(name))
        ) {
            setExpanded(true);
        }
    }, [srState]);

    return {expanded, setExpanded, toggleExpanded};
};
