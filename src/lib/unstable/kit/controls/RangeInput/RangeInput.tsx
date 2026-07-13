import React from 'react';

import {Flex, Text} from '@gravity-ui/uikit';
import isFinite from 'lodash/isFinite';

import {
    type Control,
    Entity,
    type JsonSchema,
    type JsonSchemaObject,
    type ObjectValue,
    useSchemaRendererMutators,
} from '../../../core';
import {ControlContainer} from '../../components';
import {block} from '../../utils';

import './RangeInput.scss';

const b = block('range-input');

export interface RangeInputProps {
    propertyKeys?: [string, string];
}

const Component: Control<JsonSchemaObject, RangeInputProps> = ({controlProps, input, schema}) => {
    const {name, value: inputValue} = input;
    const {propertyKeys} = controlProps;

    const prevValueRef = React.useRef<ObjectValue | null | undefined>(null);
    const {removeAndSetSchemaMutators} = useSchemaRendererMutators();

    const [fromKey, toKey] = propertyKeys || ['from', 'to'];
    const fromName = `${name}.${fromKey}`;
    const toName = `${name}.${toKey}`;

    React.useLayoutEffect(() => {
        const mutatorsToRemove: {name: string; schema: JsonSchema}[] = [];
        const mutators: {name: string; schema: JsonSchema}[] = [];

        if (prevValueRef.current?.[fromKey] !== inputValue?.[fromKey]) {
            if (isFinite(Number(prevValueRef.current?.[fromKey]))) {
                mutatorsToRemove.push({
                    name: toName,
                    schema: {minimum: Number(prevValueRef.current?.[fromKey])},
                });
            }

            if (isFinite(Number(inputValue?.[fromKey]))) {
                mutators.push({
                    name: toName,
                    schema: {minimum: Number(inputValue?.[fromKey])},
                });
            }
        }

        if (prevValueRef.current?.[toKey] !== inputValue?.[toKey]) {
            if (isFinite(Number(prevValueRef.current?.[toKey]))) {
                mutatorsToRemove.push({
                    name: fromName,
                    schema: {maximum: Number(prevValueRef.current?.[toKey])},
                });
            }

            if (isFinite(Number(inputValue?.[toKey]))) {
                mutators.push({
                    name: fromName,
                    schema: {maximum: Number(inputValue?.[toKey])},
                });
            }
        }

        if (mutatorsToRemove.length > 0 || mutators.length > 0) {
            removeAndSetSchemaMutators?.({
                mutatorsToRemove,
                mutators,
            });
        }

        prevValueRef.current = inputValue;
    }, [inputValue]);

    return (
        <ControlContainer stretch="max">
            <Flex direction="row" alignItems="flex-start" gap={2}>
                <Entity name={fromName} schema={schema.properties?.[fromKey]} />
                <Text className={b('delimiter')}>-</Text>
                <Entity name={toName} schema={schema.properties?.[toKey]} />
            </Flex>
        </ControlContainer>
    );
};

export const RangeInput = React.memo(Component);
