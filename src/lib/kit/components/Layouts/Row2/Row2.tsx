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

import './Row2.scss';

const b = block('row2');

export const Row2 = <T extends FieldValue, S extends Spec>({
    name,
    spec,
    input,
    meta,
    children,
}: LayoutProps<T, S>) => {
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
                    {isArrayItem(name) ? (
                        <Button view="flat" className={b('remove-button')} onClick={input.onDrop}>
                            <Icon data={Xmark} size={16} />
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
