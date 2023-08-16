import React from 'react';

import {Table} from '@gravity-ui/uikit';
import _ from 'lodash';

import {
    ArrayView,
    FormValue,
    ObjectValue,
    ViewController,
    isArraySpec,
    isBooleanSpec,
    isObjectSpec,
} from '../../../../core';
import i18n from '../../../i18n';
import {block} from '../../../utils';

import './TableCompactView.scss';

const b = block('table-compact-view');

export const TableCompactView: ArrayView = ({value = [], spec, name}) => {
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
            with: '40px',
            template: (__: FormValue, idx: number) => (
                <div className={b('and')} key={`idx-${idx}`}>
                    {idx > 0 ? i18n('label_and') : null}
                </div>
            ),
        };

        const columns = table.map(({property, label}) => ({
            id: property,
            name: label,
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

        return [andColumn, ...columns];
    }, [name, spec]);

    const getRowClassNames = React.useCallback(() => {
        return [b('row')];
    }, []);

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
                getRowClassNames={getRowClassNames}
            />
        </div>
    ) : null;
};
