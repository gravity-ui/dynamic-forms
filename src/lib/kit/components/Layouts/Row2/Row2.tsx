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

import './Row2.scss';

const b = block('row2');

export const Row2 = <T extends FieldValue, S extends Spec>({
    name,
    spec,
    input,
    meta,
    children,
}: LayoutProps<T, S>) => {
    const generateButton = React.useMemo(() => withGenerateButton(spec), [spec]);

    return (
        <div className={b()}>
            <div className={b('left')}>
                <div className={b('title')}>
                    {spec.viewSpec.layoutTitle}
                    {spec.required && <span className={b('required-mark')}>*</span>}
                </div>
            </div>
            <div className={b('right')}>
                <div className={b('right-inner')}>
                    <ErrorWrapper
                        name={name}
                        meta={meta}
                        withoutChildErrorStyles={isArraySpec(spec) || isObjectSpec(spec)}
                    >
                        {children}
                    </ErrorWrapper>
                    {generateButton ? (
                        <GenerateRandomValueButton
                            spec={spec as StringSpec}
                            onChange={input.onChange as (value: string) => void}
                        />
                    ) : null}
                    {isArrayItem(name) ? (
                        <Button
                            view="flat-secondary"
                            className={b('remove-button')}
                            onClick={input.onDrop}
                            qa={`${name}-remove-item`}
                        >
                            <Icon data={TrashBin} size={16} />
                        </Button>
                    ) : null}
                </div>
                {spec.viewSpec.layoutDescription ? (
                    <div
                        className={b('description')}
                        dangerouslySetInnerHTML={{__html: spec.viewSpec.layoutDescription}}
                    />
                ) : null}
            </div>
        </div>
    );
};
