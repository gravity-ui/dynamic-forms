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
    ObjectValue,
    REMOVED_ITEM,
    Spec,
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
    const {isHidden} = useSearchContext();

    const titleField = React.useMemo(
        () => spec.viewSpec.table?.map(({label}) => label),
        [spec.viewSpec.table],
    );

    const getPreparedSpec = React.useCallback(
        (entitySpec: Spec, id: number) => {
            const preparedEntitySpec = {
                ...entitySpec,
                viewSpec: {
                    ...entitySpec.viewSpec,
                    layoutTitle: titleField?.join(` ${id} `),
                },
            };

            return preparedEntitySpec;
        },
        [titleField],
    );

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
            template: (key: FieldValue, idx: number) => {
                const entitySpec = items?.properties?.[property];

                if (!entitySpec) {
                    return null;
                }

                const preparedEntitySpec = getPreparedSpec(entitySpec, idx + 1);

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
                        />
                    </div>
                );
            },
        }));

        return [idxColumn, ...columns, removeColumn];
    }, [name, spec, onItemRemove, parentOnChange, input.value]);

    const rowClassNames = React.useCallback(
        (item: ObjectValue) => {
            const searchResult = isHidden(`${name}.<${item}>`);

            return [b('row', {hide: searchResult})];
        },
        [isHidden, name],
    );

    if (!columns) {
        return null;
    }

    return (
        <div className={b()}>
            {keys.length ? (
                <Table<ObjectValue>
                    className={b('table')}
                    data={keys as unknown as ObjectValue[]}
                    columns={columns as any}
                    getRowId={(_, idx) => `${name}-${idx}`}
                    verticalAlign="top"
                    getRowClassNames={rowClassNames}
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
