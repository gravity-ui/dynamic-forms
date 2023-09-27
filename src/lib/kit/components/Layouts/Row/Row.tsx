import React from 'react';

import {HelpPopover} from '@gravity-ui/components';
import {TrashBin} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import _ from 'lodash';

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
}: LayoutProps<T, S> & RowProps) => {
    const arrayItem = React.useMemo(() => isArrayItem(name), [name]);
    const generateButton = React.useMemo(() => withGenerateButton(spec), [spec]);
    const [generateButtonWith, setGenerateButtonWith] = React.useState(0);

    const onRefChange = React.useCallback((node: HTMLSpanElement) => {
        if (_.isNull(node)) {
            setGenerateButtonWith(0);
        } else {
            setGenerateButtonWith(node.offsetWidth);
        }
    }, []);

    const withRow = React.useMemo(() => {
        if (generateButtonWith) {
            if (arrayItem) {
                return 533 + generateButtonWith;
            }

            return 500 + generateButtonWith;
        }

        return undefined;
    }, [arrayItem, generateButtonWith]);

    return (
        <div
            className={b({
                'extra-width': isArraySpec(spec) || arrayItem,
            })}
            style={{width: withRow, maxWidth: withRow}}
        >
            <div className={b('left')}>
                <div className={b('left-inner')}>
                    <span className={b('title', {required: spec.required})}>
                        {spec.viewSpec.layoutTitle}
                    </span>
                    {!verboseDescription && spec.viewSpec.layoutDescription ? (
                        <span className={b('note')}>
                            <span className={b('note-inner')}>
                                <HelpPopover
                                    htmlContent={spec.viewSpec.layoutDescription}
                                    placement={['bottom', 'top']}
                                />
                            </span>
                        </span>
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
                    {generateButton ? (
                        <span ref={onRefChange}>
                            <GenerateRandomValueButton
                                spec={spec as StringSpec}
                                onChange={input.onChange as (value: string) => void}
                            />
                        </span>
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

export const Row = <T extends FieldValue, S extends Spec>(props: LayoutProps<T, S>) => (
    <RowBase {...props} />
);

export const RowVerbose = <T extends FieldValue, S extends Spec>(props: LayoutProps<T, S>) => (
    <RowBase verboseDescription {...props} />
);
