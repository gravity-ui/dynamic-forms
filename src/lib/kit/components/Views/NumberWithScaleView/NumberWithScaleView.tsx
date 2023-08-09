import React from 'react';

import {Popover, type PopoverProps} from '@gravity-ui/uikit';

import {StringViewProps} from '../../../../core';
import {block, isCorrectSizeParams} from '../../../utils';
import {useInitial} from '../../Inputs/NumberWithScale/useInitial';

import './NumberWithScaleView.scss';

const b = block('number-with-scale-view');

const POPOVER_PLACEMENT: PopoverProps['placement'] = ['bottom', 'top'];

const NumberWithScaleViewBase: React.FC<StringViewProps> = ({spec, value}) => {
    const {initialValue, initialType} = useInitial(value || '', spec, [value]);
    const {scale} = spec.viewSpec.sizeParams!;

    return (
        <div className={b()}>
            <Popover
                placement={POPOVER_PLACEMENT}
                content={initialValue}
                className={b('tooltip-container')}
                contentClassName={b('tooltip')}
                disabled={initialValue.length < 26}
            >
                {initialValue}
            </Popover>
            <span className={b('size')}> {scale[initialType].title}</span>
        </div>
    );
};

export const NumberWithScaleView: React.FC<StringViewProps> = (props) =>
    isCorrectSizeParams(props.spec) && props.value ? <NumberWithScaleViewBase {...props} /> : null;
