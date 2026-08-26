import React from 'react';

import {Flex, Text} from '@gravity-ui/uikit';
import isFinite from 'lodash/isFinite';

import {
    type JsonSchemaObject,
    type NodeEntity,
    type ObjectValue,
    type SchemaPatch,
    type SchemaPatchRemover,
    SchemaRendererNode,
    useSchemaRendererTools,
} from '../../../core';
import {EntityContainer} from '../../components';
import {DASH} from '../../constants';
import {block} from '../../utils';

import './RangeInput.scss';

const b = block('range-input');

export interface RangeInputProps {
    propertyKeys?: [string, string];
    separator?: string;
}

export const RangeInput: NodeEntity<JsonSchemaObject, RangeInputProps> = ({
    headName,
    input,
    props,
    schemaPath,
}) => {
    const {name, value: inputValue} = input;
    const {propertyKeys, separator = DASH} = props;

    const prevValueRef = React.useRef<ObjectValue | null | undefined>(null);
    const {addSchemaPatches, removeSchemaPatches} = useSchemaRendererTools();

    const [fromKey, toKey] = propertyKeys || ['from', 'to'];
    const fromName = `${name ? name + '.' : ''}${fromKey}`;
    const toName = `${name ? name + '.' : ''}${toKey}`;

    React.useEffect(() => {
        const patches: SchemaPatch[] = [];
        const patchesToRemove: SchemaPatchRemover[] = [];

        if (prevValueRef.current?.[fromKey] !== inputValue?.[fromKey]) {
            if (isFinite(Number(prevValueRef.current?.[fromKey]))) {
                patchesToRemove.push({
                    headName,
                    name: toName,
                    schema: {minimum: Number(prevValueRef.current?.[fromKey])},
                });
            }

            if (isFinite(Number(inputValue?.[fromKey]))) {
                patches.push({
                    headName,
                    name: toName,
                    schema: {minimum: Number(inputValue?.[fromKey])},
                });
            }
        }

        if (prevValueRef.current?.[toKey] !== inputValue?.[toKey]) {
            if (isFinite(Number(prevValueRef.current?.[toKey]))) {
                patchesToRemove.push({
                    headName,
                    name: fromName,
                    schema: {maximum: Number(prevValueRef.current?.[toKey])},
                });
            }

            if (isFinite(Number(inputValue?.[toKey]))) {
                patches.push({
                    headName,
                    name: fromName,
                    schema: {maximum: Number(inputValue?.[toKey])},
                });
            }
        }

        if (patchesToRemove.length) {
            removeSchemaPatches({patchesToRemove});
        }

        if (patches.length) {
            addSchemaPatches({patches});
        }

        prevValueRef.current = inputValue;
    }, [inputValue?.[fromKey], inputValue?.[toKey]]);

    return (
        <EntityContainer stretch="max" className={b()}>
            <Flex className={b('items')} direction="row" alignItems="flex-start" gap={2}>
                <SchemaRendererNode
                    headName={headName}
                    name={fromName}
                    schemaPath={`${schemaPath}/properties/${fromKey}`}
                />
                <Text className={b('delimiter')}>{separator}</Text>
                <SchemaRendererNode
                    headName={headName}
                    name={toName}
                    schemaPath={`${schemaPath}/properties/${toKey}`}
                />
            </Flex>
        </EntityContainer>
    );
};
