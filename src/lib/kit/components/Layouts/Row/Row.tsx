import React from 'react';

import {HelpPopover} from '@gravity-ui/components';
import {TrashBin} from '@gravity-ui/icons';
import {Button, Icon, Text} from '@gravity-ui/uikit';

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

import './Row.scss';

const b = block('row');

interface RowProps {
    verboseDescription?: boolean;
}

const RowBase = <T extends FieldValue, S extends Spec>({
    name,
    spec,
    input,
    meta,
    verboseDescription,
    children,
}: LayoutProps<T, undefined, undefined, S> & RowProps) => {
    const arrayItem = React.useMemo(() => isArrayItem(name), [name]);
    const generateButton = React.useMemo(() => withGenerateButton(spec), [spec]);

    return (
        <div className={b()}>
            <div className={b('left')}>
                <div className={b('left-inner')}>
                    <Text className={b('title', {required: spec.required})}>
                        {spec.viewSpec.layoutTitle}
                    </Text>
                    {!verboseDescription && spec.viewSpec.layoutDescription ? (
                        <span className={b('note')}>
                            <Text className={b('note-inner')}>
                                <HelpPopover
                                    htmlContent={spec.viewSpec.layoutDescription}
                                    placement={['bottom', 'top']}
                                />
                            </Text>
                        </span>
                    ) : null}
                </div>
            </div>
            <div className={b('right')}>
                <div className={b('right-inner')}>
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
                {verboseDescription && spec.viewSpec.layoutDescription ? (
                    <div
                        className={b('description')}
                        dangerouslySetInnerHTML={{__html: spec.viewSpec.layoutDescription}}
                    />
                ) : null}
            </div>
        </div>
    );
};

export const Row = <T extends FieldValue, S extends Spec>(
    props: LayoutProps<T, undefined, undefined, S>,
) => <RowBase {...props} />;

export const RowVerbose = <T extends FieldValue, S extends Spec>(
    props: LayoutProps<T, undefined, undefined, S>,
) => <RowBase verboseDescription {...props} />;
