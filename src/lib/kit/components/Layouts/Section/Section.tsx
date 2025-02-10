import React from 'react';

import {HelpPopover} from '@gravity-ui/components';
import {Popover, Text, TextProps} from '@gravity-ui/uikit';

import {GroupIndent} from '../../';
import {RemoveButton} from '../../RemoveButton';
import {COMMON_POPOVER_PLACEMENT, COMMON_TITLE_MAX_WIDTH, ErrorWrapper} from '../../../';
import {
    FieldRenderProps,
    FieldValue,
    FormValue,
    LayoutProps,
    Spec,
    ViewLayoutProps,
    isArrayItem,
    isArraySpec,
    isObjectSpec,
} from '../../../../core';
import {block} from '../../../utils';

import './Section.scss';

const b = block('section');

interface SectionLayoutProps {
    variantTitle?: TextProps['variant'];
}

interface SectionProps {
    titleSize: 's' | 'm';
    withIndent?: boolean;
    ignoreDescription?: boolean;
    descriptionAsSubtitle?: boolean;
}

const SectionBase = <
    D extends FieldValue,
    T extends FormValue,
    S extends Spec<any, any, SectionLayoutProps>,
>({
    name,
    spec,
    titleSize,
    withIndent,
    ignoreDescription,
    descriptionAsSubtitle,
    children,
    ...restProps
}: (LayoutProps<D, undefined, SectionLayoutProps, S> | ViewLayoutProps<T, S>) & SectionProps) => {
    const input = (restProps as FieldRenderProps<D>).input as
        | FieldRenderProps<D>['input']
        | undefined;
    const meta = (restProps as FieldRenderProps<D>).meta as FieldRenderProps<D>['meta'] | undefined;
    const arrOrObjFlag = isArraySpec(spec) || isObjectSpec(spec);
    const titleRef = React.useRef<HTMLHeadingElement>(null);
    let content = children;

    const {variantTitle: variantTitleProp} = spec.viewSpec.layoutProps || {};

    const {sizeTitle, variantTitle} = React.useMemo(() => {
        if (variantTitleProp) {
            return {
                sizeTitle: undefined,
                variantTitle: variantTitleProp,
            };
        }

        if (titleSize === 'm') {
            return {
                sizeTitle: titleSize,
                variantTitle: 'body-2',
            };
        }

        return {
            sizeTitle: titleSize,
            variantTitle: 'body-1',
        };
    }, [variantTitleProp, titleSize]);

    const removeButton = React.useMemo(() => {
        if (input?.value && input?.onDrop && isArrayItem(name)) {
            return (
                <RemoveButton
                    name={name}
                    onDrop={input.onDrop}
                    switcherClassName={b('remove-button')}
                />
            );
        }

        return null;
    }, [input?.value, input?.onDrop, name]);

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
                <Text className={b('note')}>
                    <HelpPopover
                        htmlContent={spec.viewSpec.layoutDescription}
                        placement={['bottom', 'top']}
                    />
                </Text>
            );
        }
    }

    const layoutTitle = spec.viewSpec.layoutTitle;
    const layoutTitlePopoverDisabled =
        (titleRef.current?.offsetWidth || 0) <= COMMON_TITLE_MAX_WIDTH;

    return (
        <section className={b()}>
            {layoutTitle ? (
                <div
                    className={b('header', {
                        'with-popover': !descriptionAsSubtitle,
                        size: sizeTitle,
                    })}
                >
                    <Popover
                        className={b('title-popover')}
                        content={layoutTitle}
                        placement={COMMON_POPOVER_PLACEMENT}
                        disabled={layoutTitlePopoverDisabled}
                    >
                        <Text
                            className={b('title')}
                            variant={variantTitle as TextProps['variant']}
                            ref={titleRef}
                            ellipsis
                        >
                            {layoutTitle}
                        </Text>
                    </Popover>
                    {description}
                    {removeButton}
                </div>
            ) : null}
            <div className={b('content')}>{content}</div>
        </section>
    );
};

export const Section = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, undefined, undefined, S> | ViewLayoutProps<T, S>) &
        Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="m" {...props} />;

export const Section2 = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, undefined, undefined, S> | ViewLayoutProps<T, S>) &
        Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="s" {...props} />;

export const SectionWithSubtitle = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, undefined, undefined, S> | ViewLayoutProps<T, S>) &
        Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="m" descriptionAsSubtitle {...props} />;

export const SectionWithSubtitle2 = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, undefined, undefined, S> | ViewLayoutProps<T, S>) &
        Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="s" descriptionAsSubtitle {...props} />;

export const Group = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, undefined, undefined, S> | ViewLayoutProps<T, S>) &
        Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="m" withIndent={true} {...props} />;

export const Group2 = <D extends FieldValue, T extends FormValue, S extends Spec>(
    props: (LayoutProps<D, undefined, undefined, S> | ViewLayoutProps<T, S>) &
        Pick<SectionProps, 'ignoreDescription'>,
) => <SectionBase titleSize="s" withIndent={true} {...props} />;
