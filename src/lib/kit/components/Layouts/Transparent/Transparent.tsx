import React from 'react';

import {TrashBin} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {
    FieldValue,
    LayoutProps,
    Spec,
    StringSpec,
    isArrayItem,
    isArraySpec,
    isObjectSpec,
    withGenerateButton,
} from '../../../../core';
import {ErrorWrapper, GenerateRandomValueButton} from '../../../components';
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
    const generateButton = React.useMemo(() => withGenerateButton(spec), [spec]);
    const arrOrObjFlag = React.useMemo(() => isArraySpec(spec) || isObjectSpec(spec), [spec]);

    const removeButton = React.useMemo(() => {
        if (arrayItem) {
            return (
                <Button
                    view="flat-secondary"
                    className={b('remove-button')}
                    onClick={input.onDrop}
                    qa={`${name}-remove-item`}
                >
                    <Icon data={TrashBin} size={16} />
                </Button>
            );
        }

        return null;
    }, [input.onDrop, arrayItem, name]);

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
            {generateButton ? (
                <GenerateRandomValueButton
                    spec={spec as StringSpec}
                    onChange={input.onChange as (value: string) => void}
                />
            ) : null}
            {removeButton}
        </div>
    );
};
