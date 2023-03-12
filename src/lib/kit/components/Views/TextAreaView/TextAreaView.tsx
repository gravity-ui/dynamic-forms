import React from 'react';

import {ChevronDown} from '@gravity-ui/icons';
import {Icon} from '@gravity-ui/uikit';

import {StringView} from '../../../../core';
import {block} from '../../../utils';

import './TextAreaView.scss';

const b = block('text-area-view');

export const TextAreaView: StringView = ({value = ''}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const isValueLong = React.useMemo(() => value.length > 50, [value]);

    const handleClick = React.useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return (
        <div className={b({active: isValueLong})} onClick={isValueLong ? handleClick : undefined}>
            <div className={b('text-view', {open: isOpen})}>{value}</div>
            {isValueLong ? (
                <div>
                    <Icon data={ChevronDown} className={b('chevron', {open: isOpen})} size={16} />
                </div>
            ) : null}
        </div>
    );
};
