import React from 'react';

import {Xmark} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {
    FieldValue,
    LayoutProps,
    Spec,
    isArrayItem,
    isArraySpec,
    isObjectSpec,
} from '../../../../core';
import {ErrorWrapper} from '../../../components';
import {block} from '../../../utils';

import './Transparent.scss';

const b = block('transparent');

export const Transparent = <T extends FieldValue, S extends Spec>({
    name,
    spec,
    input,
    meta,
    children,
}: LayoutProps<T, S>) => {
    const arrayItem = React.useMemo(() => isArrayItem(name), [name]);
    const arrOrObjFlag = React.useMemo(() => isArraySpec(spec) || isObjectSpec(spec), [spec]);

    const removeButton = React.useMemo(() => {
        if (arrayItem) {
            return (
                <Button view="flat" className={b('remove-button')} onClick={input.onDrop}>
                    <Icon data={Xmark} size={16} />
                </Button>
            );
        }

        return null;
    }, [input.onDrop, arrayItem]);

    return (
        <div
            className={b({
                'array-item': arrayItem && !arrOrObjFlag,
                'without-max-width': arrOrObjFlag,
            })}
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles={arrOrObjFlag}>
                {children}
            </ErrorWrapper>
            {removeButton}
        </div>
    );
};
