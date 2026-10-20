import React from 'react';

import {block} from '../../utils';

import './GroupIndent.scss';

const b = block('group-indent');

/** @deprecated Use the SchemaRenderer API. */
export interface GroupIndentProps {
    children: React.ReactNode;
}

/** @deprecated Use the SchemaRenderer API. */
export const GroupIndent: React.FC<GroupIndentProps> = ({children}) => (
    <div className={b()}>{children}</div>
);
