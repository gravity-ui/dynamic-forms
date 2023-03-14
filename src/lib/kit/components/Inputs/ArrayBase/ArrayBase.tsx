import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import _ from 'lodash';

import {
    ArrayInput,
    ArrayValue,
    Controller,
    FieldArrayValue,
    FieldValue,
    OBJECT_ARRAY_CNT,
    OBJECT_ARRAY_FLAG,
    REMOVED_ITEM,
    Spec,
    ValidateError,
    isArraySpec,
    isCorrectSpec,
    isObjectSpec,
    transformArrIn,
} from '../../../../core';

export const ArrayBase: ArrayInput = ({spec, name, arrayInput, input}) => {
    const keys = React.useMemo(
        () =>
            Object.keys(arrayInput.value || {})
                .filter(
                    (k) =>
                        k !== OBJECT_ARRAY_FLAG &&
                        k !== OBJECT_ARRAY_CNT &&
                        arrayInput.value[k] !== REMOVED_ITEM,
                )
                .map((k) => k.split('<').join('').split('>').join(''))
                .sort((a, b) => Number(a) - Number(b)),
        [arrayInput.value],
    );

    const itemSpecCorrect = React.useMemo(() => isCorrectSpec(spec.items), [spec.items]);

    const onItemAdd = React.useCallback(() => {
        let item;

        if (!spec.items?.required) {
            if (isArraySpec(spec.items)) {
                item = {OBJECT_ARRAY_FLAG: true, OBJECT_ARRAY_CNT: 0};
            } else if (isObjectSpec(spec.items)) {
                item = {};
            }
        }

        arrayInput.onItemAdd(item);
    }, [arrayInput.onItemAdd, spec.items]);

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

    const items = React.useMemo(
        () =>
            keys.map((key, idx) => {
                const itemSpec = getItemSpec(idx);

                if (!itemSpec) {
                    return null;
                }

                return (
                    <Controller
                        initialValue={input.value?.[`<${key}>`]}
                        parentOnChange={parentOnChange}
                        spec={itemSpec}
                        name={`${name}.<${key}>`}
                        key={`${name}.<${key}>`}
                    />
                );
            }),
        [keys.join(''), name, getItemSpec, parentOnChange, input.value],
    );

    if (!itemSpecCorrect) {
        return null;
    }

    return (
        <React.Fragment>
            {items}
            {!arrayInput.value && spec.defaultValue ? (
                <Button
                    onClick={() =>
                        input.onChange(
                            transformArrIn<ArrayValue, FieldArrayValue>(spec.defaultValue!),
                        )
                    }
                    disabled={spec.viewSpec.disabled}
                >
                    <Icon data={Plus} size={14} />
                    {spec.viewSpec.layoutTitle || null}
                </Button>
            ) : (
                <Button onClick={onItemAdd} disabled={spec.viewSpec.disabled}>
                    <Icon data={Plus} size={14} />
                    {spec.viewSpec.itemLabel || null}
                </Button>
            )}
        </React.Fragment>
    );
};