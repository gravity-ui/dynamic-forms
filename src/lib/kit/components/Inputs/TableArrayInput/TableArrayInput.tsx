import React from 'react';

import {Plus, TrashBin} from '@gravity-ui/icons';
import {Button, Flex, Icon, Popover, Table} from '@gravity-ui/uikit';
import {HelpPopover} from '@gravity-ui/components';
import noop from 'lodash/noop';
import set from 'lodash/set';

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
import {block} from '../../../utils';
import i18n from '../../../i18n';

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

    const disabledButtonLength = React.useMemo(() => {
        if (spec.viewSpec.enableLockLength) {
            return {
                remove: keys.length <= (spec.minLength || 0),
                add: keys.length >= (spec.maxLength || Infinity),
            };
        }

        return {
            remove: false,
            add: false,
        };
    }, [keys.length, spec.maxLength, spec.minLength, spec.viewSpec.enableLockLength]);

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

        const idxColumn = {
            id: 'idx',
            name: '',
            sticky: 'left',
            template: ({key}: {key: string}, idx: number) => (
                <div className={b('idx')} key={`idx-${key}`}>
                    {idx + 1}
                </div>
            ),
        };

        const removeColumn = {
            id: 'remove',
            name: '',
            sticky: 'right',
            template: ({key}: {key: string}) => (
                <Popover
                    content={i18n('label_error-min-length-array', {
                        count: spec.minLength,
                    })}
                    disabled={!disabledButtonLength.remove}
                >
                    <Button
                        view="flat-secondary"
                        onClick={() => onItemRemove(key)}
                        key={`remove-${key}`}
                        qa={`${name}-item-remove-${key}`}
                        disabled={disabledButtonLength.remove}
                    >
                        <Icon data={TrashBin} size={16} />
                    </Button>
                </Popover>
            ),
        };

        const columns = table.map(({property, label, description}) => ({
            id: property,
            name: !description
                ? label
                : () => (
                      <Flex gap={0.5} alignItems="center">
                          {label}
                          <HelpPopover htmlContent={description} placement={['bottom', 'top']} />
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
                            parentOnUnmount={noop}
                        />
                    </div>
                );
            },
        }));

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
                <Popover
                    content={i18n('label_error-max-length-array', {
                        count: spec.maxLength,
                    })}
                    disabled={!disabledButtonLength.add}
                >
                    <Button
                        onClick={onItemAdd}
                        disabled={spec.viewSpec.disabled || disabledButtonLength.add}
                        qa={`${name}-add-item`}
                    >
                        <Icon data={Plus} size={14} />
                        {spec.viewSpec.itemLabel || null}
                    </Button>
                </Popover>
            )}
        </div>
    );
};
