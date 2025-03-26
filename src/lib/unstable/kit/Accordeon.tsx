import React from 'react';

// import {ArrayLayoutProps, ObjectLayoutProps, isArrayItem} from '../../../../core';
import {ErrorWrapper, type ErrorWrapperProps} from '../../kit/components';
// import {useErrorChecker} from '../../../hooks';
// import {RemoveButton} from '../../kit/components/RemoveButton';
import {SimpleVerticalAccordeon} from '../../kit/components/SimpleVerticalAccordeon';
import type {JsonSchema, WrapperProps} from '../core/types';

export const Accordeon = <Schema extends JsonSchema>({
    schema,
    input,
    meta,
    children,
}: WrapperProps<Schema>): JSX.Element => {
    const [open, setOpen] = React.useState(Boolean(schema.entityParameters?.wrapperProps?.open));

    // const onDrop = React.useCallback(() => {
    //     setOpen(false);
    //     input.onDrop();
    // }, [input.onDrop, setOpen]);

    // const removeButton = React.useMemo(() => {
    //     if (!isArrayItem(name) && (spec.required || !input.value)) {
    //         return null;
    //     }

    //     return <RemoveButton name={name} onDrop={onDrop} />;
    // }, [spec.required, input.value, onDrop, name]);

    // useErrorChecker({name, meta, open, setOpen});

    return (
        <SimpleVerticalAccordeon
            name={input.name}
            title={schema.title || ''}
            note={schema.description || ''}
            open={open}
            onOpenChange={setOpen}
            // headerActionsTemplate={removeButton}
            hideInsteadOfDestroy
            withBranchView
        >
            <ErrorWrapper
                name={input.name}
                meta={meta as ErrorWrapperProps['meta']}
                // ff
                withoutChildErrorStyles
            >
                {children}
            </ErrorWrapper>
        </SimpleVerticalAccordeon>
    );
};
