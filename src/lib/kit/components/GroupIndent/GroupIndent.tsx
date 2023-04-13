import React from 'react';

import {block} from '../../utils';

import './GroupIndent.scss';

const b = block('group-indent');

export interface GroupIndentProps {
    children: React.ReactNode;
    oneof?: boolean;
}

export const GroupIndent: React.FC<GroupIndentProps> = ({children, oneof}) => (
    <div className={b({oneof})}>{children}</div>
);
