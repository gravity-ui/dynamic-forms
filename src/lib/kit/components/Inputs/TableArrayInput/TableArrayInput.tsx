import React from 'react';

import {Plus, TrashBin} from '@gravity-ui/icons';
import {Button, Flex, HelpMark, Icon, Table, type TableColumnConfig} from '@gravity-ui/uikit';
import noop from 'lodash/noop';
import set from 'lodash/set';

import type {
    ArrayInput,
    ArrayValue,
    FieldArrayValue,
    FieldObjectValue,
    FieldValue,
    ValidateError,
} from '../../../../core';
import {
    Controller,
    OBJECT_ARRAY_CNT,
    OBJECT_ARRAY_FLAG,
    isArraySpec,
    isBooleanSpec,
    isObjectSpec,
    transformArrIn,
} from '../../../../core';
import {useSearchContext} from '../../../../core/components/Form/hooks';
import {COMMON_POPOVER_PLACEMENT} from '../../../constants/common';
import {block} from '../../../utils';
import {HTMLContent} from '../../HTMLContent';

import './TableArrayInput.scss';

const b = block('table-array');

export const TableArrayInput: ArrayInput = ({spec, name, arrayInput, input}) => {
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
                    set({...currentValue}, childName.split(`${input.name}.`).join(''), childValue),
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

        const idxColumn: TableColumnConfig<{key: string}> = {
            id: 'idx',
            name: '',
            sticky: 'left',
            template: ({key}: {key: string}, idx: number) => (
                <div className={b('idx')} key={`idx-${key}`}>
                    {idx + 1}
                </div>
            ),
        };

        const removeColumn: TableColumnConfig<{key: string}> = {
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

        const columns: TableColumnConfig<{key: string}>[] = table.map(
            ({property, label, description, width}) => ({
                id: property,
                name: !description
                    ? () => (
                          <div
                              className={b('column-title')}
                              style={{minWidth: width, maxWidth: width}}
                          >
                              {label}
                          </div>
                      )
                    : () => (
                          <Flex
                              gap={0.5}
                              alignItems="center"
                              style={{minWidth: width, maxWidth: width}}
                          >
                              <div className={b('column-title')}>{label}</div>
                              <HelpMark
                                  popoverProps={{
                                      placement: COMMON_POPOVER_PLACEMENT,
                                  }}
                              >
                                  <HTMLContent html={description} />
                              </HelpMark>
                          </Flex>
                      ),
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
                            className={b(width ? 'cell-without-limit' : 'cell', {
                                bool: isBooleanSpec(preparedEntitySpec),
                                arr: isArraySpec(preparedEntitySpec),
                                obj: isObjectSpec(preparedEntitySpec),
                            })}
                            style={{minWidth: width, maxWidth: width}}
                            key={`${name}.<${key}>.${property}`}
                        >
                            <Controller
                                value={(input.value?.[`<${key}>`] as FieldObjectValue)?.[property]}
                                spec={preparedEntitySpec}
                                name={`${name}.<${key}>.${property}`}
                                parentOnChange={parentOnChange}
                                parentOnUnmount={noop}
                            />
                        </div>
                    );
                },
            }),
        );

        return [idxColumn, ...columns, removeColumn];
    }, [name, spec, onItemRemove, parentOnChange, input.parentOnUnmount, input.value]);

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
            ) : null}
            {!arrayInput.value && spec.defaultValue ? (
                <Button
                    onClick={() =>
                        input.onChange(
                            transformArrIn<ArrayValue, FieldArrayValue>(spec.defaultValue!),
                        )
                    }
                    disabled={spec.viewSpec.disabled}
                    qa={`${name}-init-arr`}
                >
                    <Icon data={Plus} size={14} />
                    {spec.viewSpec.layoutTitle || null}
                </Button>
            ) : (
                <Button
                    onClick={onItemAdd}
                    disabled={spec.viewSpec.disabled}
                    qa={`${name}-add-item`}
                >
                    <Icon data={Plus} size={14} />
                    {spec.viewSpec.itemLabel || null}
                </Button>
            )}
        </div>
    );
};
