import React from 'react';

import type {StringViewProps} from '../../../../core';
import i18n from '../../../../kit/i18n';
import {LongValue} from '../../../components';

export const FileInputView: React.FC<StringViewProps> = ({value, spec}) => (
    <LongValue value={spec.viewSpec.fileInput?.ignoreText ? i18n('label-data_loaded') : value} />
);
