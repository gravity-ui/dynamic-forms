import React from 'react';

import {Text, type TextProps} from '@gravity-ui/uikit';

export interface HTMLContentProps extends TextProps {
    html: string;
}

export const HTMLContent: React.FC<HTMLContentProps> = ({html, ...restProps}) => {
    return <Text {...restProps} dangerouslySetInnerHTML={{__html: html}} />;
};
