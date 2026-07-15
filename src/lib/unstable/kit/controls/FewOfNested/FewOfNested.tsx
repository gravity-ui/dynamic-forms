import React from 'react';

import isString from 'lodash/isString';

import {
    type Control,
    Entity,
    type JsonSchema,
    type JsonSchemaObject,
    SchemaRendererMode,
    getRenderKit,
    useEntitiesState,
} from '../../../core';
import {ControlContainer} from '../../components';
import {block} from '../../utils';

import './FewOfNested.scss';

const b = block('one-of-nested');

export interface FewOfNestedProps {
    toggler: JsonSchema;
    withIndent?: boolean;
    togglerArrayRemoveButton?: boolean;
}

const Component: Control<JsonSchemaObject, FewOfNestedProps> = ({
    controlProps,
    input,
    meta,
    schema,
    ControlWrapper,
    controlWrapperProps,
}) => {
    const {name, value} = input;
    const {
        togglerArrayRemoveButton = false,
        toggler: togglerSchema = {},
        withIndent = false,
    } = controlProps;

    const {config} = useEntitiesState(name);

    const [togglerValues, setTogglerValues] = React.useState<string[]>(() => {
        if (value && Object.keys(value).length) {
            return Object.keys(value);
        }

        if (schema.properties && Object.keys(schema.properties).length) {
            return [Object.keys(schema.properties)[0]];
        }

        return [];
    });

    const toggler = React.useMemo(() => {
        let result: React.ReactNode = null;
        const formKit = getRenderKit({config, schema: togglerSchema})[SchemaRendererMode.Form];
        const togglerInput = {
            ...input,
            name: togglerArrayRemoveButton ? name : `${name}._____toggler`,
            value: togglerValues,
            onChange: (value: unknown) => {
                if (Array.isArray(value)) {
                    setTogglerValues(value.filter(isString));
                }
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
    }, [config, name, input, meta, togglerArrayRemoveButton, togglerSchema, togglerValues]);

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
            {togglerValues.length ? (
                <div className={b('content', {'with-indent': withIndent})}>
                    {togglerValues.map((togglerValue) => (
                        <Entity
                            key={togglerValue}
                            name={`${name}.${togglerValue}`}
                            schema={schema.properties?.[togglerValue]}
                        />
                    ))}
                </div>
            ) : null}
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

export const FewOfNested = React.memo(Component);
