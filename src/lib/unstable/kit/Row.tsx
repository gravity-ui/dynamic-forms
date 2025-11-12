// import {TrashBin} from '@gravity-ui/icons';
// import {Button, Icon, Text} from '@gravity-ui/uikit';
import React from 'react';

import {HelpMark, Text} from '@gravity-ui/uikit';

// import // StringSpec,
// isArrayItem,
// isArraySpec,
// isObjectSpec,
// withGenerateButton,
// from '../../../';
// import {ErrorWrapper, GenerateRandomValueButton} from '../../../kit/components';
import {COMMON_POPOVER_PLACEMENT} from '../../../lib/kit/constants/common';
import {ErrorWrapper} from '../../kit/components';
import {block} from '../../kit/utils';
import type {JsonSchema, WrapperProps} from '../core/types';

import './Row.scss';

const b = block('row');

interface RowProps {
    verboseDescription?: boolean;
}

const RowBase = <Schema extends JsonSchema>({
    schema,
    input,
    meta,
    verboseDescription,
    // wrapperProps,
    children,
}: WrapperProps<Schema, {qtest: boolean}> & RowProps) => {
    // const arrayItem = React.useMemo(() => isArrayItem(name), [name]);
    // const generateButton = React.useMemo(() => withGenerateButton(spec), [spec]);

    return (
        <div className={b()}>
            <div className={b('left')}>
                <div className={b('left-inner')}>
                    <Text
                        className={b('title', {
                            required: schema.entityParameters?.wrapperProps?.required,
                        })}
                    >
                        {schema.title}
                    </Text>
                    {!verboseDescription && schema.description ? (
                        <span className={b('note')}>
                            <Text className={b('note-inner')}>
                                <HelpMark
                                    popoverProps={{
                                        placement: COMMON_POPOVER_PLACEMENT,
                                    }}
                                >
                                    {schema.description}
                                </HelpMark>
                            </Text>
                        </span>
                    ) : null}
                </div>
            </div>
            <div className={b('right')}>
                <div className={b('right-inner')}>
                    <ErrorWrapper
                        name={input.name}
                        // @ts-expect-error
                        meta={meta}
                        // withoutChildErrorStyles={
                        //     // TODO: remove condition spec.viewSpec.type !== 'select'
                        //     (isArraySpec(spec) && spec.viewSpec.type !== 'select') ||
                        //     isObjectSpec(spec)
                        // }
                        className={b('error-wrapper')}
                        ff
                    >
                        {children}
                    </ErrorWrapper>
                    {/* {generateButton ? (
                        <GenerateRandomValueButton
                            spec={spec as StringSpec}
                            onChange={input.onChange as (value: string) => void}
                        />
                    ) : null} */}
                    {/* {arrayItem ? (
                        <Button
                            view="flat-secondary"
                            className={b('remove-button')}
                            onClick={input.onDrop}
                            qa={`${name}-remove-item`}
                        >
                            <Icon data={TrashBin} size={16} />
                        </Button>
                    ) : null} */}
                </div>
                {verboseDescription && schema.description ? (
                    <div
                        className={b('description')}
                        dangerouslySetInnerHTML={{__html: schema.description}}
                    />
                ) : null}
            </div>
        </div>
    );
};

const RowComponent = <Schema extends JsonSchema>(
    props: WrapperProps<Schema, {qtest: boolean; qwa?: string}>,
) => <RowBase {...props} />;

export const Row = React.memo(RowComponent);

const RowVerboseComponent = <Schema extends JsonSchema>(
    props: WrapperProps<Schema, {qtest: boolean; qwa?: string}>,
) => <RowBase verboseDescription {...props} />;

export const RowVerbose = React.memo(RowVerboseComponent);
