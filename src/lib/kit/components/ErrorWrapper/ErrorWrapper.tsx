import React from 'react';

import {FieldRenderProps, FieldValue} from '../../../core';
import {block} from '../../utils';

import './ErrorWrapper.scss';

const b = block('error-wrapper');

export interface ErrorWrapperProps {
    children: React.ReactNode;
    name: string;
    meta: FieldRenderProps<FieldValue>['meta'];
    withoutChildErrorStyles?: boolean;
}

export const ErrorWrapper: React.FC<ErrorWrapperProps> = ({
    name,
    meta,
    withoutChildErrorStyles,
    children,
}) => {
    const error = React.useMemo(() => {
        if ((meta.touched || meta.submitFailed) && meta.error) {
            return meta.error;
        }

        return;
    }, [meta.touched, meta.submitFailed, meta.error]);

    const props = React.useMemo(
        () => (meta.error ? {'data-form-error': true, 'data-form-error-name': name} : {}),
        [meta.error, name],
    );

    return (
        <span className={b({error: !withoutChildErrorStyles && Boolean(error)})} {...props}>
            {children}
            {error && typeof error === 'string' ? (
                <div className={b('error-text')}>{error}</div>
            ) : null}
        </span>
    );
};
