import React from 'react';

import type {FormValue} from '../../../lib';

interface DynLinkProps {
    value: FormValue;
    link: string;
}

export const DynLink: React.FC<DynLinkProps> = ({value, link}) => (
    <a
        href={link}
        onClick={(e) => {
            alert(`Link clicked, your text: ${value}`);
            e.preventDefault();
        }}
    >
        {String(value)}
    </a>
);
