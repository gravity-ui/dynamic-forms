import React from 'react';

import {
    type Control,
    Entity,
    EntityType,
    type JsonSchema,
    type JsonSchemaObject,
    SchemaRendererMode,
    getRenderKit,
    useEntitiesState,
} from '../../../core';
import {ControlContainer} from '../../components';
import {block} from '../../utils';

import './OneOfNested.scss';

const b = block('one-of-nested');

export interface OneOfNestedProps {
    toggler: JsonSchema;
    booleanToKey?: {true: string; false: string};
    withIndent?: boolean;
    togglerArrayRemoveButton?: boolean;
}

const Component: Control<JsonSchemaObject, OneOfNestedProps> = ({
    controlProps,
    input,
    meta,
    schema,
    ControlWrapper,
    controlWrapperProps,
}) => {
    const {name, value} = input;
    const {
        booleanToKey,
        togglerArrayRemoveButton = false,
        toggler: togglerSchema = {},
        withIndent = false,
    } = controlProps;

    const {config} = useEntitiesState(name);

    const [togglerValue, setTogglerValue] = React.useState<string>(
        Object.keys(value || schema.properties || {})[0] || '',
    );

    const toggler = React.useMemo(() => {
        let result: React.ReactNode = null;
        const formKit = getRenderKit({config, schema: togglerSchema})[SchemaRendererMode.Form];
        const togglerInput = {
            ...input,
            name: togglerArrayRemoveButton ? name : `${name}._____toggler`,
            value:
                (togglerSchema.entityParameters?.type === EntityType.Boolean &&
                    booleanToKey &&
                    booleanToKey.true === togglerValue) ??
                togglerValue,
            onChange: (value: unknown) => {
                const nextValue = `${value}`;

                setTogglerValue(booleanToKey?.[nextValue as 'true' | 'false'] || nextValue);
            },
        };
        const togglerMeta = {
            ...meta,
            error: undefined,
        };

        if (formKit.Control) {
            if (formKit.independent) {
                result = (
                    <formKit.Control
                        input={togglerInput}
                        meta={togglerMeta}
                        schema={togglerSchema}
                        controlProps={formKit.controlProps}
                        ControlWrapper={formKit.ControlWrapper}
                        controlWrapperProps={formKit.controlWrapperProps}
                    />
                );
            } else {
                result = (
                    <formKit.Control
                        input={togglerInput}
                        meta={togglerMeta}
                        schema={togglerSchema}
                        controlProps={formKit.controlProps}
                    />
                );

                if (formKit.ControlWrapper) {
                    result = (
                        <formKit.ControlWrapper
                            input={togglerInput}
                            meta={togglerMeta}
                            schema={togglerSchema}
                            controlWrapperProps={formKit.controlWrapperProps}
                        >
                            {result}
                        </formKit.ControlWrapper>
                    );
                }
            }
        }

        return result;
    }, [
        booleanToKey,
        config,
        name,
        input,
        meta,
        togglerArrayRemoveButton,
        togglerSchema,
        togglerValue,
    ]);

    const wrapperInput = React.useMemo(() => {
        if (!togglerArrayRemoveButton) {
            return input;
        }

        return {
            ...input,
            name: `${name}._____wrapper`,
        };
    }, [name, input, togglerArrayRemoveButton]);

    let content = (
        <ControlContainer stretch="by-child">
            {toggler}
            <div className={b('content', {'with-indent': withIndent})}>
                <Entity
                    name={`${name}.${togglerValue}`}
                    schema={schema.properties?.[togglerValue]}
                />
            </div>
        </ControlContainer>
    );

    if (ControlWrapper) {
        content = (
            <ControlWrapper
                input={wrapperInput}
                meta={meta}
                schema={schema}
                controlWrapperProps={controlWrapperProps || {}}
            >
                {content}
            </ControlWrapper>
        );
    }

    return content;
};

export const OneOfNested = React.memo(Component);
