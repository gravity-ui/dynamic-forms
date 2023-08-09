import React from 'react';

import {HelpPopover} from '@gravity-ui/components';
import {Popover, type PopoverProps} from '@gravity-ui/uikit';

import {GroupIndent} from '../../';
import {ErrorWrapper} from '../../../';
import {
    type FieldRenderProps,
    type FieldValue,
    type FormValue,
    type LayoutProps,
    type Spec,
    type ViewLayoutProps,
    isArraySpec,
    isObjectSpec,
} from '../../../../core';
import {block} from '../../../utils';

import './Section.scss';

const b = block('section');

interface SectionProps {
    titleSize: 's' | 'm';
    withIndent?: boolean;
    ignoreDescription?: boolean;
    descriptionAsSubtitle?: boolean;
}

const POPOVER_PLACEMENT: PopoverProps['placement'] = ['bottom', 'top'];
const MAX_TITLE_WIDTH = 533;

const SectionBase = <D extends FieldValue, T extends FormValue, S extends Spec>({
    name,
    spec,
    titleSize,
    withIndent,
    ignoreDescription,
    descriptionAsSubtitle,
    children,
    ...restProps
}: (LayoutProps<D, S> | ViewLayoutProps<T, S>) & SectionProps) => {
    const meta = (restProps as FieldRenderProps<D>).meta as FieldRenderProps<D>['meta'] | undefined;
    const arrOrObjFlag = isArraySpec(spec) || isObjectSpec(spec);
    const titleRef = React.useRef<HTMLHeadingElement>(null);
    let content = children;

    if (meta) {
        content = (
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles={arrOrObjFlag}>
                {content}
            </ErrorWrapper>
        );
    }

    if (withIndent) {
        content = <GroupIndent>{content}</GroupIndent>;
    }

    let description: React.ReactNode;
    if (spec.viewSpec.layoutDescription && !ignoreDescription) {
        if (descriptionAsSubtitle) {
            description = (
                <div
                    className={b('description')}
                    dangerouslySetInnerHTML={{
                        __html: spec.viewSpec.layoutDescription,
                    }}
                />
            );
        } else {
            description = (
                <div className={b('note')}>
                    <HelpPopover
                        htmlContent={spec.viewSpec.layoutDescription}
                        placement={['bottom', 'top']}
                    />
                </div>
            );
        }
    }

    const layoutTitle = spec.viewSpec.layoutTitle;
    const layoutTitlePopoverDisabled = (titleRef.current?.offsetWidth || 0) < MAX_TITLE_WIDTH;

    return (
        <section className={b()}>
            {layoutTitle ? (
                <div
                    className={b('header', {
                        'with-popover': !descriptionAsSubtitle,
                    })}
                >
                    <Popover
                        content={layoutTitle}
                        placement={POPOVER_PLACEMENT}
                        disabled={layoutTitlePopoverDisabled}
                    >
                        <h2 className={b('title', {size: titleSize})} ref={titleRef}>
                            {layoutTitle}
                        </h2>
                    </Popover>
                    {description}
                </div>
            ) : null}
            <div className={b('content')}>{content}</div>
        </section>
    );
};

export const Section = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, S> | ViewLayoutProps<T, S>) & Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="m" {...props} />;

export const Section2 = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, S> | ViewLayoutProps<T, S>) & Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="s" {...props} />;

export const SectionWithSubtitle = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, S> | ViewLayoutProps<T, S>) & Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="m" descriptionAsSubtitle {...props} />;

export const SectionWithSubtitle2 = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, S> | ViewLayoutProps<T, S>) & Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="s" descriptionAsSubtitle {...props} />;

export const Group = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, S> | ViewLayoutProps<T, S>) & Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="m" withIndent={true} {...props} />;

export const Group2 = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, S> | ViewLayoutProps<T, S>) & Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="s" withIndent={true} {...props} />;
