import React from 'react';

import {Flex} from '@gravity-ui/uikit';

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
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

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
    Wrapper,
    wrapperProps,
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

        if (formKit.Component) {
            if (formKit.independent) {
                result = (
                    <formKit.Component
                        input={togglerInput}
                        meta={togglerMeta}
                        schema={togglerSchema}
                        controlProps={formKit.props}
                        Wrapper={formKit.Wrapper}
                        wrapperProps={formKit.wrapperProps}
                    />
                );
            } else {
                result = (
                    <formKit.Component
                        input={togglerInput}
                        meta={togglerMeta}
                        schema={togglerSchema}
                        controlProps={formKit.props}
                    />
                );

                if (formKit.Wrapper) {
                    result = (
                        <formKit.Wrapper
                            input={togglerInput}
                            meta={togglerMeta}
                            schema={togglerSchema}
                            wrapperProps={formKit.wrapperProps}
                        >
                            {result}
                        </formKit.Wrapper>
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
        <Flex width="100%" direction="column">
            <Flex direction="column">
                {toggler}
                <div className={b('content', {'with-indent': withIndent})}>
                    <Entity
                        name={`${name}.${togglerValue}`}
                        schema={schema.properties?.[togglerValue]}
                    />
                </div>
            </Flex>
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </Flex>
    );

    if (Wrapper) {
        content = (
            <Wrapper
                input={wrapperInput}
                meta={meta}
                schema={schema}
                wrapperProps={wrapperProps || {}}
            >
                {content}
            </Wrapper>
        );
    }

    return content;
};

export const OneOfNested = React.memo(Component);
