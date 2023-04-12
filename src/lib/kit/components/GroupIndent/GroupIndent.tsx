import React from 'react';

import {block} from '../../utils';

import './GroupIndent.scss';

const b = block('group-indent');

export interface GroupIndentProps {
    children: React.ReactNode;
    oneOf?: boolean;
}

export const GroupIndent: React.FC<GroupIndentProps> = ({children, oneOf}) => (
    <div className={b({oneOf})}>{children}</div>
);
