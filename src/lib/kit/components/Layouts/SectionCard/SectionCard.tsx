import React from 'react';

import {AccordeonCard} from '../../';
import {ErrorWrapper} from '../../../';
import {
    FieldRenderProps,
    FieldValue,
    FormValue,
    LayoutProps,
    Spec,
    ViewLayoutProps,
    isArraySpec,
    isObjectSpec,
} from '../../../../core';
import {block} from '../../../utils';

import './SectionCard.scss';

const b = block('section-card');

export interface SectionCardProps {
    titleSize: 's' | 'm';
    ignoreDescription?: boolean;
}

const SectionCardBase = <D extends FieldValue, T extends FormValue, S extends Spec>({
    name,
    spec,
    titleSize,
    ignoreDescription,
    children,
    ...restProps
}: (LayoutProps<D, S> | ViewLayoutProps<T, S>) & SectionCardProps) => {
    const meta = (restProps as FieldRenderProps<D>).meta as FieldRenderProps<D>['meta'] | undefined;
    const arrOrObjFlag = isArraySpec(spec) || isObjectSpec(spec);
    let content = children;

    if (meta) {
        content = (
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles={arrOrObjFlag}>
                {content}
            </ErrorWrapper>
        );
    }

    return (
        <AccordeonCard
            className={b()}
            header={spec.viewSpec.layoutTitle}
            description={ignoreDescription ? undefined : spec.viewSpec.layoutDescription}
            titleSize={titleSize}
            alwaysOpen
        >
            {content}
        </AccordeonCard>
    );
};

export const SectionCard = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, S> | ViewLayoutProps<T, S>) &
        Pick<SectionCardProps, 'ignoreDescription'>,
) => <SectionCardBase {...props} titleSize="m" />;

export const SectionCard2 = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, S> | ViewLayoutProps<T, S>) &
        Pick<SectionCardProps, 'ignoreDescription'>,
) => <SectionCardBase {...props} titleSize="s" />;
