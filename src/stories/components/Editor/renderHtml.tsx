import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import yfmTransform from '@diplodoc/transform';

export const renderHtml = (text: string) => {
    const result = yfmTransform(text, {
        disableLiquid: true,
        linkify: true,
        allowHTML: true,
    }).result.html;

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: result,
            }}
        />
    );
};
