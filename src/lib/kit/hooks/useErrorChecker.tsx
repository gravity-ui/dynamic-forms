import React from 'react';

import type {FieldRenderProps, FieldValue} from '../../core';

export interface UseErrorCheckerParams {
    name: string;
    meta: FieldRenderProps<FieldValue>['meta'];
    open: boolean;
    setOpen: (flag: boolean) => void;
}

export const useErrorChecker = ({name, meta, open, setOpen}: UseErrorCheckerParams) => {
    React.useEffect(() => {
        if (
            meta.submitFailed &&
            document.querySelector(`[data-form-error-name*="${name}"]`) &&
            !open
        ) {
            setOpen(true);
        }
    }, [meta.submitFailed]);
};
