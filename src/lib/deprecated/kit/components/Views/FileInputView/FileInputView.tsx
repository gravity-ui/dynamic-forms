import React from 'react';

import {LongValue} from '../..';
import i18n from '../../../../../kit/i18n';
import type {StringViewProps} from '../../../../core';

/** @deprecated Use the SchemaRenderer API. */
export const FileInputView: React.FC<StringViewProps> = ({value, spec}) => (
    <LongValue value={spec.viewSpec.fileInput?.ignoreText ? i18n('label-data_loaded') : value} />
);
