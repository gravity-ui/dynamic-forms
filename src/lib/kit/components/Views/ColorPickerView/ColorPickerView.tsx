import React from 'react';

import type {StringView} from '../../../../core';
import {LongValue} from '../../../components';
import {block} from '../../../utils';

import './ColorPickerView.scss';

const b = block('color-picker-view');

export const ColorPickerView: StringView = ({value = ''}) => (
    <div className={b()}>
        {value ? <div className={b('preview')} style={{backgroundColor: value}} /> : null}
        <LongValue value={value} />
    </div>
);
