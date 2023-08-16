import React from 'react';

import {Plus, TrashBin} from '@gravity-ui/icons';
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
    ValidateError,
    isArraySpec,
    isBooleanSpec,
    isObjectSpec,
    transformArrIn,
} from '../../../../core';
import {useSearchContext} from '../../../../core/components/Form/hooks';
import i18n from '../../../i18n';
import {block} from '../../../utils';

import './TableCompact.scss';

const b = block('table-compact');

export const TableCompact: ArrayInput = ({spec, name, arrayInput, input}) => {
    const {isHiddenField} = useSearchContext();

    const keys = React.useMemo(
        () =>
            Object.keys(arrayInput.value || {})
                .filter((k) => k !== OBJECT_ARRAY_FLAG && k !== OBJECT_ARRAY_CNT)
                .map((k) => k.split('<').join('').split('>').join(''))
                .sort((a, b) => Number(a) - Number(b))
                .map((key) => ({
                    key,
                })),
        [arrayInput.value],
    );

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

    const AddButton: React.FC = React.useCallback(() => {
        const onItemAdd = () => arrayInput.onItemAdd({});

        if (!arrayInput.value && spec.defaultValue) {
            return (
                <Button
                    view="flat-secondary"
                    onClick={() =>
                        input.onChange(
                            transformArrIn<ArrayValue, FieldArrayValue>(spec.defaultValue!),
                        )
                    }
                    disabled={spec.viewSpec.disabled}
                    qa={`${name}-init-arr`}
                >
                    <Icon data={Plus} size={14} />
                </Button>
            );
        }

        return (
            <Button
                view="flat-secondary"
                onClick={onItemAdd}
                disabled={spec.viewSpec.disabled}
                qa={`${name}-add-item`}
            >
                <Icon data={Plus} size={14} />
            </Button>
        );
    }, [arrayInput, input, name, spec.defaultValue, spec.viewSpec.disabled]);

    const columns = React.useMemo(() => {
        const {
            items,
            viewSpec: {table},
        } = spec;

        if (!table?.length || !isObjectSpec(items)) {
            return null;
        }

        const andColumn = {
            id: 'idx',
            name: '',
            sticky: 'left',
            template: ({key}: {key: string}, idx: number) => (
                <div className={b('and')} key={`idx-${key}`}>
                    {idx > 0 ? i18n('label_and') : null}
                </div>
            ),
        };

        const addRowColumn = {
            id: 'addRow',
            name: '',
            sticky: 'right',
            template: ({key}: {key: string}) => {
                const lastKey = keys[keys.length - 1].key;

                if (lastKey !== key) {
                    return <div key={`idx-${key}`}></div>;
                }

                return <AddButton key={`idx-${key}`} />;
            },
        };

        const removeColumn = {
            id: 'remove',
            name: '',
            sticky: 'right',
            template: ({key}: {key: string}) => (
                <Button
                    view="flat-secondary"
                    onClick={() => onItemRemove(key)}
                    key={`remove-${key}`}
                    qa={`${name}-item-remove-${key}`}
                >
                    <Icon data={TrashBin} size={16} />
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
                            value={(input.value?.[`<${key}>`] as FieldObjectValue)?.[property]}
                            spec={preparedEntitySpec}
                            name={`${name}.<${key}>.${property}`}
                            parentOnChange={parentOnChange}
                            parentOnUnmount={_.noop}
                        />
                    </div>
                );
            },
        }));

        return [andColumn, ...columns, removeColumn, addRowColumn];
    }, [spec, keys, AddButton, name, onItemRemove, input.value, parentOnChange]);

    const getRowClassNames = React.useCallback(
        ({key}: {key: string}) => {
            const searchResult = spec.viewSpec.table?.every(({property}) =>
                isHiddenField(`${name}.<${key}>.${property}`),
            );

            return [b('row', {hidden: searchResult})];
        },
        [isHiddenField, name, spec.viewSpec.table],
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
            ) : (
                <AddButton />
            )}
        </div>
    );
};
