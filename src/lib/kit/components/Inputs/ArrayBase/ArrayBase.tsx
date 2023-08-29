import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Icon, Label} from '@gravity-ui/uikit';
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
import {block} from '../../../utils';

import './ArrayBase.scss';

const b = block('array-base');

export const ArrayBase: ArrayInput = ({spec, name, arrayInput, input}) => {
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
        let onClick = () => {
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

        let qa = `${name}-add-item`;
        let title = spec.viewSpec.itemLabel;

        if (!arrayInput.value && spec.defaultValue) {
            onClick = () => {
                input.onChange(transformArrIn<ArrayValue, FieldArrayValue>(spec.defaultValue!));
            };

            qa = `${name}-init-arr`;
            title = spec.viewSpec.layoutTitle;
        }

        return (
            <Button
                onClick={onClick}
                disabled={spec.viewSpec.disabled}
                qa={qa}
                className={b('add-button', {right: spec.viewSpec.addButtonPosition === 'right'})}
            >
                <Icon data={Plus} size={14} />
                {title || null}
            </Button>
        );
    }, [
        arrayInput,
        input,
        name,
        spec.defaultValue,
        spec.items,
        spec.viewSpec.disabled,
        spec.viewSpec.itemLabel,
        spec.viewSpec.layoutTitle,
    ]);

    const items = React.useMemo(
        () =>
            keys.map((key, idx) => {
                const itemSpec = getItemSpec(idx);

                if (!itemSpec) {
                    return null;
                }

                const showItemPrefix = idx !== 0 && spec.viewSpec.itemPrefix;

                return (
                    <React.Fragment key={`${name}.<${key}>`}>
                        {showItemPrefix ? (
                            <Label size="m" className={b('item-prefix')}>
                                {spec.viewSpec.itemPrefix}
                            </Label>
                        ) : null}
                        <Controller
                            value={input.value?.[`<${key}>`]}
                            parentOnChange={parentOnChange}
                            parentOnUnmount={input.parentOnUnmount}
                            spec={itemSpec}
                            name={`${name}.<${key}>`}
                        />
                    </React.Fragment>
                );
            }),
        [
            keys.join(''),
            name,
            getItemSpec,
            parentOnChange,
            input.parentOnUnmount,
            input.value,
            spec.viewSpec.itemPrefix,
        ],
    );

    if (!itemSpecCorrect) {
        return null;
    }

    return (
        <div className={b({'add-button-right': spec.viewSpec.addButtonPosition === 'right'})}>
            <div
                className={b('items-wrapper', {
                    'add-button-down':
                        spec.viewSpec.addButtonPosition !== 'right' && keys.length > 0,
                })}
            >
                {items}
            </div>
            <AddButton />
        </div>
    );
};
