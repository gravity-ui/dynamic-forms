import React from 'react';

import {block} from '../../utils';

import './GroupIndent.scss';

const b = block('group-indent');

export interface GroupIndentProps {
    children: React.ReactNode;
}

export const GroupIndent: React.FC<GroupIndentProps> = ({children}) => (
    <div className={b()}>{children}</div>
);
