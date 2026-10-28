import i18n from '../i18n';
import {subscribeConfigure} from '../i18n/configure';

import type {ErrorMessagesType} from './types';

const getErrorMessages = (): ErrorMessagesType => ({
    REQUIRED: i18n('label_error-required'),
    INVALID: i18n('label_error-invalid'),
    INT: i18n('label_error-int'),
    NUMBER: i18n('label_error-number'),
    minLength(count: number | bigint) {
        return i18n('label_error-min-length', {count});
    },
    minLengthArr(count: number | bigint) {
        return i18n('label_error-min-length-array', {count});
    },
    maxLength(count: number | bigint) {
        return i18n('label_error-max-length', {count});
    },
    maxLengthArr(count: number | bigint) {
        return i18n('label_error-max-length-array', {count});
    },
    minNumber(count: number | bigint) {
        return i18n('label_error-min-number', {count});
    },
    maxNumber(count: number | bigint) {
        return i18n('label_error-max-number', {count});
    },
    minNumberWithScale(count: number | bigint | string, scale: string) {
        return i18n('label_error-min-number-with-scale', {count, scale});
    },
    maxNumberWithScale(count: number | bigint | string, scale: string) {
        return i18n('label_error-max-number-with-scale', {count, scale});
    },
    SPACE_START: i18n('label_error-space-start'),
    SPACE_END: i18n('label_error-space-end'),
    DOT_END: i18n('label_error-dot-end'),
    ZERO_START: i18n('label_error-zero-start'),
    INVALID_ZERO_FORMAT: i18n('label_error-invalid-zero-format'),
    ZERO_END: i18n('label_error-zero-end'),
});

export let ErrorMessages: ErrorMessagesType = getErrorMessages();

subscribeConfigure(() => {
    ErrorMessages = getErrorMessages();
});
