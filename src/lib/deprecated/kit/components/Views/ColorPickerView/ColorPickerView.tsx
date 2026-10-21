import React from 'react';

import {LongValue} from '../..';
import type {StringView} from '../../../../core';
import {block} from '../../../utils';

import './ColorPickerView.scss';

const b = block('color-picker-view');

/** @deprecated Use the SchemaRenderer API. */
export const ColorPickerView: StringView = ({value = ''}) => (
    <div className={b()}>
        {value ? <div className={b('preview')} style={{backgroundColor: value}} /> : null}
        <LongValue value={value} />
    </div>
);
