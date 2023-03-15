import React from 'react';

import {Xmark} from '@gravity-ui/icons';
import {Button, HelpPopover, Icon} from '@gravity-ui/uikit';

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
}: LayoutProps<T, S> & RowProps) => {
    const arrayItem = React.useMemo(() => isArrayItem(name), [name]);

    return (
        <div className={b({'extra-width': isArraySpec(spec) || arrayItem})}>
            <div className={b('left')}>
                <div className={b('left-inner')}>
                    <div className={b('title')}>
                        {spec.viewSpec.layoutTitle}
                        {spec.required && <span className={b('required-mark')}>*</span>}
                    </div>
                    {!verboseDescription && spec.viewSpec.layoutDescription ? (
                        <div className={b('note')}>
                            <HelpPopover
                                htmlContent={spec.viewSpec.layoutDescription}
                                placement={['bottom', 'top']}
                            />
                        </div>
                    ) : null}
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
                    {arrayItem ? (
                        <Button view="flat" className={b('remove-button')} onClick={input.onDrop}>
                            <Icon data={Xmark} size={16} />
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

export const Row = <T extends FieldValue, S extends Spec>(props: LayoutProps<T, S>) => (
    <RowBase {...props} />
);

export const RowVerbose = <T extends FieldValue, S extends Spec>(props: LayoutProps<T, S>) => (
    <RowBase verboseDescription {...props} />
);
