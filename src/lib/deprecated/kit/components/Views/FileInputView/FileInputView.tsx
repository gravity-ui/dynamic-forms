import React from 'react';

import {LongValue} from '../..';
import i18n from '../../../../../i18n';
import type {StringViewProps} from '../../../../core';

export const FileInputView: React.FC<StringViewProps> = ({value, spec}) => (
    <LongValue value={spec.viewSpec.fileInput?.ignoreText ? i18n('label-data_loaded') : value} />
);
