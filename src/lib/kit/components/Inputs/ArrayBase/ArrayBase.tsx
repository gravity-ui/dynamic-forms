import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Icon, Popover} from '@gravity-ui/uikit';
import _ from 'lodash';

import {
    ArrayInput,
    ArrayValue,
    Controller,
    FieldArrayValue,
    FieldValue,
    OBJECT_ARRAY_CNT,
    OBJECT_ARRAY_FLAG,
    Spec,
    ValidateError,
    isArraySpec,
    isCorrectSpec,
    isObjectSpec,
    transformArrIn,
} from '../../../../core';
import {COMMON_POPOVER_PLACEMENT} from '../../../constants/common';
import {block} from '../../../utils';

import './ArrayBase.scss';

const b = block('array-base');

export const ArrayBase: ArrayInput = ({spec, name, arrayInput, input}) => {
    const [itemPrefixParams, setItemPrefixParams] = React.useState({
        disabledPopover: true,
        width: 0,
    });

    const keys = React.useMemo(
        () =>
            Object.keys(arrayInput.value || {})
                .filter((k) => k !== OBJECT_ARRAY_FLAG && k !== OBJECT_ARRAY_CNT)
                .map((k) => k.split('<').join('').split('>').join(''))
                .sort((a, b) => Number(a) - Number(b)),
        [arrayInput.value],
    );

    const itemSpecCorrect = React.useMemo(() => isCorrectSpec(spec.items), [spec.items]);

    const getItemSpec = React.useCallback(
        (idx: number): typeof spec.items | null => {
            if (!itemSpecCorrect) {
                return null;
            }

            const itemSpec = {...spec.items} as Spec;

            itemSpec.viewSpec = {
                ...itemSpec.viewSpec,
                layoutTitle: itemSpec.viewSpec.layoutTitle
                    ? `${itemSpec.viewSpec.layoutTitle} ${idx + 1}`
                    : `${idx + 1}`,
            };

            return itemSpec;
        },
        [spec.items, itemSpecCorrect],
    );

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    _.set(
                        {...currentValue},
                        childName.split(`${input.name}.`).join(''),
                        childValue,
                    ),
                childErrors,
            ),
        [input.onChange, input.name],
    );

    const AddButton: React.FC = React.useCallback(() => {
        const onItemAdd = () => {
            let item;

            if (!spec.items?.required) {
                if (isArraySpec(spec.items)) {
                    item = {[OBJECT_ARRAY_FLAG]: true, [OBJECT_ARRAY_CNT]: 0};
                } else if (isObjectSpec(spec.items)) {
                    item = {};
                }
            }

            arrayInput.onItemAdd(item);
        };

        const viewButton =
            spec.viewSpec.addButtonPosition === 'right' ? 'flat-secondary' : 'normal';

        if (!arrayInput.value && spec.defaultValue) {
            return (
                <Button
                    view={viewButton}
                    onClick={() =>
                        input.onChange(
                            transformArrIn<ArrayValue, FieldArrayValue>(spec.defaultValue!),
                        )
                    }
                    disabled={spec.viewSpec.disabled}
                    qa={`${name}-init-arr`}
                >
                    <Icon data={Plus} size={14} />
                    {spec.viewSpec.addButtonPosition === 'right'
                        ? null
                        : spec.viewSpec.layoutTitle || null}
                </Button>
            );
        }

        return (
            <Button
                view={viewButton}
                onClick={onItemAdd}
                disabled={spec.viewSpec.disabled}
                qa={`${name}-add-item`}
            >
                <Icon data={Plus} size={14} />
                {spec.viewSpec.addButtonPosition === 'right'
                    ? null
                    : spec.viewSpec.itemLabel || null}
            </Button>
        );
    }, [
        arrayInput,
        input,
        name,
        spec.defaultValue,
        spec.items,
        spec.viewSpec.addButtonPosition,
        spec.viewSpec.disabled,
        spec.viewSpec.itemLabel,
        spec.viewSpec.layoutTitle,
    ]);

    const items = React.useMemo(
        () =>
            keys.map((key, idx) => {
                const itemSpec = getItemSpec(idx);
                const lastIndex = keys.length - 1;

                if (!itemSpec) {
                    return null;
                }

                if (!spec.viewSpec.itemPrefix && spec.viewSpec.addButtonPosition !== 'right') {
                    return (
                        <Controller
                            value={input.value?.[`<${key}>`]}
                            parentOnChange={parentOnChange}
                            parentOnUnmount={input.parentOnUnmount}
                            spec={itemSpec}
                            key={`${name}.<${key}>`}
                            name={`${name}.<${key}>`}
                        />
                    );
                }

                const itemPrefix = idx === 0 ? null : spec.viewSpec.itemPrefix;
                const style = idx === 0 ? {width: itemPrefixParams.width} : undefined;

                return (
                    <div key={`${name}.<${key}>`} className={b('item-wrapper')}>
                        {spec.viewSpec.itemPrefix ? (
                            <Popover
                                placement={COMMON_POPOVER_PLACEMENT}
                                content={itemPrefix}
                                className={b('item-prefix')}
                                contentClassName={b('item-prefix-tooltip')}
                                disabled={idx === 0 ? true : itemPrefixParams.disabledPopover}
                            >
                                <span
                                    id={`${idx}-item-prefix`}
                                    className={b('item-prefix-text', {
                                        'long-value': !itemPrefixParams.disabledPopover,
                                    })}
                                    style={style}
                                >
                                    {itemPrefix}
                                </span>
                            </Popover>
                        ) : null}
                        <Controller
                            value={input.value?.[`<${key}>`]}
                            parentOnChange={parentOnChange}
                            parentOnUnmount={input.parentOnUnmount}
                            spec={itemSpec}
                            name={`${name}.<${key}>`}
                        />
                        {lastIndex === idx && spec.viewSpec.addButtonPosition === 'right' ? (
                            <AddButton />
                        ) : null}
                    </div>
                );
            }),
        [
            keys.join(''),
            name,
            getItemSpec,
            parentOnChange,
            input.parentOnUnmount,
            input.value,
            spec.viewSpec.addButtonPosition,
            spec.viewSpec.itemPrefix,
            AddButton,
            itemPrefixParams,
        ],
    );

    React.useEffect(() => {
        if (spec.viewSpec.itemPrefix) {
            const width = document.getElementById(`1-item-prefix`)?.offsetWidth || 0;
            const disabledPopover = width < 50;

            setItemPrefixParams({width, disabledPopover});
        }
    }, [spec.viewSpec.itemPrefix, keys]);

    if (!itemSpecCorrect) {
        return null;
    }

    return (
        <React.Fragment>
            {items}
            {spec.viewSpec.addButtonPosition !== 'right' || !keys.length ? <AddButton /> : null}
        </React.Fragment>
    );
};
