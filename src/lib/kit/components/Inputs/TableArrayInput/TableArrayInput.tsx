import React from 'react';

import {Plus, Xmark} from '@gravity-ui/icons';
import {Button, Icon, Table} from '@gravity-ui/uikit';
import _ from 'lodash';

import {
    ArrayInput,
    ArrayValue,
    Controller,
    FieldArrayValue,
    FieldObjectValue,
    FieldValue,
    OBJECT_ARRAY_CNT,
    OBJECT_ARRAY_FLAG,
    REMOVED_ITEM,
    ValidateError,
    isArraySpec,
    isBooleanSpec,
    isObjectSpec,
    transformArrIn,
} from '../../../../core';
import {useSearchContext} from '../../../../core/components/Form/hooks';
import {block} from '../../../utils';

import './TableArrayInput.scss';

const b = block('table-array');

export const TableArrayInput: ArrayInput = ({spec, name, arrayInput, input}) => {
    const {isHiddenField} = useSearchContext();

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
                .sort((a, b) => Number(a) - Number(b))
                .map((key) => ({
                    key,
                })),
        [arrayInput.value],
    );

    const onItemAdd = React.useCallback(() => {
        arrayInput.onItemAdd({});
    }, [arrayInput.onItemAdd]);

    const onItemRemove = React.useCallback(
        (key: string) => {
            arrayInput.onItemRemove(key);
        },
        [arrayInput.onItemRemove],
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

    const parentOnUnmount = React.useCallback(
        (childName: string) => input.onChange((currentValue) => currentValue, {[childName]: false}),
        [input.onChange],
    );

    const columns = React.useMemo(() => {
        const {
            items,
            viewSpec: {table},
        } = spec;

        if (!table?.length || !isObjectSpec(items)) {
            return null;
        }

        const idxColumn = {
            id: 'idx',
            name: '',
            sticky: 'left',
            template: (key: FieldValue, idx: number) => (
                <div className={b('idx')} key={`idx-${key}`}>
                    {idx + 1}
                </div>
            ),
        };

        const removeColumn = {
            id: 'remove',
            name: '',
            sticky: 'right',
            template: (key: FieldValue) => (
                <Button
                    view="flat"
                    onClick={() => onItemRemove(key as string)}
                    key={`remove-${key}`}
                >
                    <Icon data={Xmark} size={16} />
                </Button>
            ),
        };

        const columns = table.map(({property, label}) => ({
            id: property,
            name: label,
            template: (
                {
                    key,
                }: {
                    key: string;
                },
                idx: number,
            ) => {
                const entitySpec = items?.properties?.[property];

                if (!entitySpec) {
                    return null;
                }

                const preparedEntitySpec = {
                    ...entitySpec,
                    viewSpec: {
                        ...entitySpec.viewSpec,
                        layoutTitle:
                            table.map(({label}) => label).join(` ${idx + 1} `) + ` ${idx + 1}`,
                    },
                };

                return (
                    <div
                        className={b('cell', {
                            bool: isBooleanSpec(preparedEntitySpec),
                            arr: isArraySpec(preparedEntitySpec),
                            obj: isObjectSpec(preparedEntitySpec),
                        })}
                        key={`${name}.<${key}>.${property}`}
                    >
                        <Controller
                            initialValue={
                                (input.value?.[`<${key}>`] as FieldObjectValue)?.[property]
                            }
                            spec={preparedEntitySpec}
                            name={`${name}.<${key}>.${property}`}
                            parentOnChange={parentOnChange}
                            parentOnUnmount={parentOnUnmount}
                        />
                    </div>
                );
            },
        }));

        return [idxColumn, ...columns, removeColumn];
    }, [name, spec, onItemRemove, parentOnChange, parentOnUnmount, input.value]);

    const getRowClassNames = React.useCallback(
        ({key}: {key: string}) => {
            const searchResult = isHiddenField(`${name}.<${key}>`);

            return [b('row', {hidden: searchResult})];
        },
        [isHiddenField, name],
    );

    if (!columns) {
        return null;
    }

    return (
        <div className={b()}>
            {keys.length ? (
                <Table
                    className={b('table')}
                    data={keys}
                    columns={columns}
                    getRowId={(_, idx) => `${name}-${idx}`}
                    verticalAlign="top"
                    getRowClassNames={getRowClassNames}
                />
            ) : null}
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
        </div>
    );
};
