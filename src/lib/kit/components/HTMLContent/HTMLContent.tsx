import React from 'react';

import {isFunction} from 'lodash';

import {useRenderHtml as useRenderHtmlForm} from '../../../core/components/Form/hooks/useRenderHtml';
import {useRenderHtml as useRenderHtmlView} from '../../../core/components/View/hooks/useRenderHtml';

interface HTMLContentProps {
    html: string;
    className?: string;
}

export const HTMLContent: React.FC<HTMLContentProps> = ({html, className}) => {
    const renderHtmlForm = useRenderHtmlForm();
    const renderHtmlView = useRenderHtmlView();

    const content = React.useMemo(() => {
        if (renderHtmlForm && isFunction(renderHtmlForm)) {
            return renderHtmlForm(html);
        }
        if (renderHtmlView && isFunction(renderHtmlView)) {
            return renderHtmlView(html);
        }

        return <div className={className} dangerouslySetInnerHTML={{__html: html}} />;
    }, [className, html, renderHtmlForm, renderHtmlView]);

    return <React.Fragment>{content}</React.Fragment>;
};
