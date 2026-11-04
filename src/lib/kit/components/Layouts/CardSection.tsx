import React from 'react';

import type {FieldValue, LayoutProps, Spec} from '../../../core';
import {isArrayItem} from '../../../core';
import {Card, ErrorWrapper} from '../../components';
import {getQaBase} from '../../utils/qa';
import {RemoveButton} from '../RemoveButton';

export const CardSection = <T extends FieldValue, S extends Spec>({
    name,
    spec,
    input,
    meta,
    children,
}: LayoutProps<T, undefined, undefined, S>) => {
    const qaBase = getQaBase(name, spec);

    const removeButton = React.useMemo(() => {
        if (!isArrayItem(name) && (spec.required || !input.value)) {
            return null;
        }

        return <RemoveButton onDrop={input.onDrop} name={qaBase} />;
    }, [spec.required, input.value, input.onDrop, name, qaBase]);

    return (
        <Card
            name={qaBase}
            title={spec.viewSpec.layoutTitle}
            description={spec.viewSpec.layoutDescription}
            actions={removeButton}
            alwaysOpen
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles>
                {children}
            </ErrorWrapper>
        </Card>
    );
};
