import React from 'react';

import {TrashBin} from '@gravity-ui/icons';
import {Button, HelpMark, Icon, Text} from '@gravity-ui/uikit';

import type {FieldValue, LayoutProps, Spec, StringSpec} from '../../../../core';
import {isArrayItem, isArraySpec, isObjectSpec, withGenerateButton} from '../../../../core';
import {ErrorWrapper, GenerateRandomValueButton} from '../../../components';
import {COMMON_POPOVER_PLACEMENT} from '../../../constants/common';
import {block} from '../../../utils';

import './Column.scss';

const b = block('column');

interface ColumnProps {}

const ColumnBase = <T extends FieldValue, S extends Spec>({
    name,
    spec,
    input,
    meta,
    children,
}: LayoutProps<T, undefined, undefined, S> & ColumnProps) => {
    const arrayItem = React.useMemo(() => isArrayItem(name), [name]);
    const generateButton = React.useMemo(() => withGenerateButton(spec), [spec]);

    return (
        <div className={b()}>
            <div className={b('first-row')}>
                <div className={b('first-row-inner')}>
                    <Text className={b('title', {required: spec.required})}>
                        {spec.viewSpec.layoutTitle}
                    </Text>
                    {spec.viewSpec.layoutDescription ? (
                        <span className={b('note')}>
                            <Text className={b('note-inner')}>
                                <HelpMark
                                    popoverProps={{
                                        placement: COMMON_POPOVER_PLACEMENT,
                                    }}
                                >
                                    {spec.viewSpec.layoutDescription}
                                </HelpMark>
                            </Text>
                        </span>
                    ) : null}
                </div>
            </div>
            <div className={b('second-row')}>
                <div className={b('second-row-inner')}>
                    <ErrorWrapper
                        name={name}
                        meta={meta}
                        withoutChildErrorStyles={
                            // TODO: remove condition spec.viewSpec.type !== 'select'
                            (isArraySpec(spec) && spec.viewSpec.type !== 'select') ||
                            isObjectSpec(spec)
                        }
                        className={b('error-wrapper')}
                    >
                        {children}
                    </ErrorWrapper>
                    {generateButton ? (
                        <GenerateRandomValueButton
                            spec={spec as StringSpec}
                            onChange={input.onChange as (value: string) => void}
                        />
                    ) : null}
                    {arrayItem ? (
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
            </div>
        </div>
    );
};

export const Column = <T extends FieldValue, S extends Spec>(
    props: LayoutProps<T, undefined, undefined, S>,
) => <ColumnBase {...props} />;
