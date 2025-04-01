import React from 'react';

import {Flex, HelpMark, Table} from '@gravity-ui/uikit';

import type {ArrayView, FormValue, ObjectValue} from '../../../../core';
import {
    ViewController,
    isArraySpec,
    isBooleanSpec,
    isObjectSpec,
    useDynamicFormsCtx,
} from '../../../../core';
import {COMMON_POPOVER_PLACEMENT} from '../../../constants/common';
import {block} from '../../../utils';
import {HTMLContent} from '../../HTMLContent';

import './TableArrayView.scss';

const b = block('table-array-view');

export const TableArrayView: ArrayView = ({value = [], spec, name}) => {
    const {showLayoutDescription} = useDynamicFormsCtx();

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
            template: (__: FormValue, idx: number) => (
                <div className={b('idx')} key={`idx-${idx}`}>
                    {idx + 1}
                </div>
            ),
        };

        const columns = table.map(({property, label, description}) => ({
            id: property,
            name:
                description && showLayoutDescription
                    ? () => (
                          <Flex gap={0.5} alignItems="center">
                              {label}
                              <HelpMark
                                  popoverProps={{
                                      placement: COMMON_POPOVER_PLACEMENT,
                                  }}
                              >
                                  <HTMLContent html={description} />
                              </HelpMark>
                          </Flex>
                      )
                    : label,
            template: (_: FormValue, idx: number) => {
                const entitySpec = items?.properties?.[property];

                if (!entitySpec) {
                    return null;
                }

                return (
                    <div
                        className={b('cell', {
                            bool: isBooleanSpec(entitySpec),
                            arr: isArraySpec(entitySpec),
                            obj: isObjectSpec(entitySpec),
                        })}
                        key={`${name}[${idx}].${property}`}
                    >
                        <ViewController spec={entitySpec} name={`${name}[${idx}].${property}`} />
                    </div>
                );
            },
        }));

        return [idxColumn, ...columns];
    }, [name, spec, showLayoutDescription]);

    if (!columns) {
        return null;
    }

    return value.length ? (
        <div className={b()}>
            <Table<ObjectValue>
                className={b('table')}
                data={value as ObjectValue[]}
                columns={columns}
                getRowId={(_, idx) => `${name}-${idx}`}
                verticalAlign="top"
            />
        </div>
    ) : null;
};
