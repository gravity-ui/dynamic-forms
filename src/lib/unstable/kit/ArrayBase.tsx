import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

// import {
//     ArrayInput,
//     ArrayValue,
//     Controller,
//     FieldArrayValue,
//     FieldValue,
//     OBJECT_ARRAY_CNT,
//     OBJECT_ARRAY_FLAG,
//     Spec,
//     ValidateError,
//     isBooleanSpec,
//     isCorrectSpec,
//     isNumberSpec,
//     isStringSpec,
//     transformArrIn,
// } from '../../../../core';
import {block} from '../../kit/utils';
import {Entity} from '../core/components/Entity';
import type {JsonSchemaArray, SimpleView} from '../core/types';

import './ArrayBase.scss';

const b = block('array-base');

export const ArrayBase: SimpleView<JsonSchemaArray> = ({input, schema}) => {
    // const keys = React.useMemo(
    //     () =>
    //         Object.keys(arrayInput.value || {})
    //             .filter((k) => k !== OBJECT_ARRAY_FLAG && k !== OBJECT_ARRAY_CNT)
    //             .map((k) => k.split('<').join('').split('>').join(''))
    //             .sort((a, b) => Number(a) - Number(b)),
    //     [arrayInput.value],
    // );

    // const itemSpecCorrect = React.useMemo(() => isCorrectSpec(spec.items), [spec.items]);

    // const itemsPrimitive = React.useMemo(() => {
    //     return isBooleanSpec(spec.items) || isNumberSpec(spec.items) || isStringSpec(spec.items);
    // }, [spec.items]);

    const getItemSpec = React.useCallback(
        (idx: number): typeof schema.items | null => {
            const itemSpec = {...schema.items};

            // @ts-expect-error
            itemSpec.title = itemSpec.title ? `${itemSpec.title} ${idx + 1}` : `${idx + 1}`;
            // @ts-expect-error
            return itemSpec;
        },
        [schema.items],
    );

    // const parentOnChange = React.useCallback(
    //     (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
    //         input.onChange(
    //             (currentValue) =>
    //                 set({...currentValue}, childName.split(`${input.name}.`).join(''), childValue),
    //             childErrors,
    //         ),
    //     [input.onChange, input.name],
    // );

    const AddButton: React.FC = React.useCallback(() => {
        let onClick = () => input.onChange([...(input.value || []), undefined]);

        let qa = `${input.name}-add-item`;
        let title = schema.title;

        if (!input.value && schema.default) {
            onClick = () => {
                // input.onChange(transformArrIn<ArrayValue, FieldArrayValue>(spec.defaultValue!));
                input.onChange(schema.default);
            };

            qa = `${name}-init-arr`;
            title = schema.title;
        }

        return (
            <Button
                onClick={onClick}
                disabled={schema.readOnly}
                qa={qa}
                // className={b('add-button', {
                //     right: spec.viewSpec.addButtonPosition === 'right',
                // })}
            >
                <Icon data={Plus} size={14} />
                {title || null}
            </Button>
        );
    }, [
        // arrayInput,
        // input,
        // name,
        // spec.defaultValue,
        // spec.viewSpec.disabled,
        // spec.viewSpec.itemLabel,
        // spec.viewSpec.layoutTitle,
        // spec.viewSpec.addButtonPosition,
        input,
        schema,
    ]);

    const items = React.useMemo(
        () =>
            (input.value || []).map((_key, idx) => {
                const itemSpec = getItemSpec(idx);

                if (!itemSpec) {
                    return null;
                }

                // const showItemPrefix = idx !== 0 && spec.viewSpec.itemPrefix;

                return (
                    <React.Fragment key={`${input.name}[${idx}]`}>
                        {/* {showItemPrefix ? (
                            <Label size="m" className={b('item-prefix')}>
                                {spec.viewSpec.itemPrefix}
                            </Label>
                        ) : null} */}
                        <Entity
                            name={input.name + `[${idx}]`}
                            // @ts-expect-error
                            schema={itemSpec}
                            // value={input.value?.[`<${key}>`]}
                            // parentOnChange={parentOnChange}
                            // parentOnUnmount={input.parentOnUnmount}
                            // spec={itemSpec}
                            // name={`${name}.<${key}>`}
                        />
                    </React.Fragment>
                );
            }),
        [input, schema],
    );

    // if (!itemSpecCorrect) {
    //     return null;
    // }

    return (
        <div className={b()}>
            <div className={b('items-wrapper')}>{items}</div>
            <AddButton />
        </div>
    );
};
