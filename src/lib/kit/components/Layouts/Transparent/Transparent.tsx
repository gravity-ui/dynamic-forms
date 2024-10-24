import React from 'react';

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
    additionalContentLayout,
}: LayoutProps<T, undefined, undefined, S>) => {
    const arrayItem = React.useMemo(() => isArrayItem(name), [name]);
    const generateButton = React.useMemo(() => withGenerateButton(spec), [spec]);
    const arrOrObjFlag = React.useMemo(() => isArraySpec(spec) || isObjectSpec(spec), [spec]);

    return (
        <div
            className={b({
                'array-item': arrayItem && !arrOrObjFlag,
                'without-max-width': arrOrObjFlag,
            })}
        >
            <ErrorWrapper
                name={name}
                meta={meta}
                withoutChildErrorStyles={
                    // TODO: remove condition spec.viewSpec.type !== 'select'
                    (isArraySpec(spec) && spec.viewSpec.type !== 'select') || isObjectSpec(spec)
                }
            >
                {children}
            </ErrorWrapper>
            {generateButton ? (
                <GenerateRandomValueButton
                    spec={spec as StringSpec}
                    onChange={input.onChange as (value: string) => void}
                />
            ) : null}
            {additionalContentLayout}
        </div>
    );
};
