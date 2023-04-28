import React from 'react';

import {FieldValue, LayoutProps, Spec} from '../../../core';
import {Card, ErrorWrapper} from '../../components';

import {RemoveButton} from './Accordeon/RemoveButton';

export const CardSection = <T extends FieldValue, S extends Spec>({
    name,
    spec,
    input,
    meta,
    children,
}: LayoutProps<T, S>) => {
    const removeButton = React.useMemo(() => {
        if (spec.required || !input.value) {
            return null;
        }

        return <RemoveButton onDrop={input.onDrop} name={name} />;
    }, [spec.required, input.value, input.onDrop, name]);

    return (
        <Card
            name={name}
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
