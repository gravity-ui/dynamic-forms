import React from 'react';

interface HTMLContentProps {
    html: string;
}

export const HTMLContent: React.FC<HTMLContentProps> = ({html}) => {
    return <div dangerouslySetInnerHTML={{__html: html}} />;
};
