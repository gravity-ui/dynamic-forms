import React from 'react';

import {Flex, Text, spacing, useTheme} from '@gravity-ui/uikit';
import get from 'lodash/get';
import noop from 'lodash/noop';
import {Form, useForm} from 'react-final-form';
import MonacoEditor from 'react-monaco-editor';

import {SchemaRenderer, SchemaRendererMode} from '../../../lib/unstable/core';
import type {JsonSchema} from '../../../lib/unstable/core/types';
import {MonacoContainer, config} from '../../../lib/unstable/kit';

const monacoOptions = {
    automaticLayout: true,
    fontSize: 12,
    minimap: {enabled: false},
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
};

const getMonacoHeight = (value: unknown) => {
    const lines = JSON.stringify(value ?? null, (_, v) => v ?? null, 2).split('\n').length;

    return `${lines * 18 + 36}px`;
};

const userContext = {MonacoEditor};

const SubmitOnMount: React.FC = () => {
    const form = useForm();

    React.useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            form.submit();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [form]);

    return null;
};

const SyncViewValue: React.FC<{value: unknown}> = ({value}) => {
    const form = useForm();

    React.useEffect(() => {
        form.change(`step.${SchemaRendererMode.Overview}`, value);
    }, [form, value]);

    return null;
};

interface ExampleProps {
    schema: JsonSchema;
    submitOnMount?: boolean;
    title: string;
    value: unknown;
}

const Example: React.FC<ExampleProps> = ({schema, submitOnMount, title, value}) => {
    const theme = useTheme();

    const style: React.CSSProperties = {
        padding: '12px',
        border: '1px solid var(--g-color-line-generic)',
        borderRadius: '8px',
    };

    return (
        <Flex direction="column" gap="4" style={style}>
            <Text variant="subheader-3">{title}</Text>
            <Form
                destroyOnUnregister
                initialValues={{
                    step: {[SchemaRendererMode.Form]: value, [SchemaRendererMode.Overview]: value},
                }}
                onSubmit={noop}
                validateOnBlur={false}
            >
                {({values}) => (
                    <React.Fragment>
                        {submitOnMount ? <SubmitOnMount /> : null}
                        <SyncViewValue value={get(values, `step.${SchemaRendererMode.Form}`)} />
                        <Flex direction="column" gap="4">
                            <Flex direction="column" gap="4">
                                <Text variant="subheader-2">Form</Text>
                                <SchemaRenderer
                                    config={config}
                                    mode={SchemaRendererMode.Form}
                                    name={`step.${SchemaRendererMode.Form}`}
                                    schema={schema}
                                    userContext={userContext}
                                    validateOnBlur={false}
                                />
                            </Flex>
                            <Flex direction="column" gap="4">
                                <Text variant="subheader-2">View</Text>
                                <SchemaRenderer
                                    config={config}
                                    mode={SchemaRendererMode.Overview}
                                    name={`step.${SchemaRendererMode.Overview}`}
                                    schema={schema}
                                    userContext={userContext}
                                    validateOnBlur={false}
                                />
                            </Flex>
                            <Flex direction="column" gap="4">
                                <Text variant="subheader-2">Value</Text>
                                <MonacoContainer
                                    height={getMonacoHeight(
                                        get(values, `step.${SchemaRendererMode.Form}`),
                                    )}
                                    language="json"
                                    width="100%"
                                >
                                    <MonacoEditor
                                        language="json"
                                        options={{
                                            ...monacoOptions,
                                            readOnly: true,
                                            scrollbar: {
                                                vertical: 'hidden',
                                                horizontal: 'hidden',
                                                handleMouseWheel: false,
                                            },
                                        }}
                                        theme={`vs-${theme.includes('dark') ? 'dark' : 'light'}`}
                                        value={JSON.stringify(
                                            get(values, `step.${SchemaRendererMode.Form}`),
                                            (_, v) => v ?? null,
                                            2,
                                        )}
                                    />
                                </MonacoContainer>
                            </Flex>
                        </Flex>
                    </React.Fragment>
                )}
            </Form>
        </Flex>
    );
};

export interface EntityPreviewProps {
    correctValue?: unknown;
    emptyValue?: unknown;
    incorrectValue?: unknown;
    schema: JsonSchema;
    title: string;
}

export const EntityPreview: React.FC<EntityPreviewProps> = ({
    correctValue,
    emptyValue,
    incorrectValue,
    schema: jsonSchema,
    title,
}) => {
    const theme = useTheme();
    const [schema, setSchema] = React.useState<JsonSchema>(jsonSchema);

    return (
        <Flex direction="column">
            <Text
                className={spacing({px: 4, pt: 4, pb: 4})}
                style={{
                    background: 'var(--g-color-base-background)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                }}
                variant="subheader-3"
            >
                {title}
            </Text>
            <Flex
                alignItems="flex-start"
                className={spacing({px: 4, pb: 4})}
                direction="row"
                gap="4"
            >
                <Flex
                    alignSelf="flex-start"
                    direction="column"
                    style={{position: 'sticky', top: 56}}
                >
                    <MonacoContainer
                        height={`min(${getMonacoHeight(schema)}, calc(100vh - 56px - 16px - 40px))`}
                        language="JSON-schema"
                        width="480px"
                    >
                        <MonacoEditor
                            language="json"
                            options={monacoOptions}
                            theme={`vs-${theme.includes('dark') ? 'dark' : 'light'}`}
                            defaultValue={JSON.stringify(jsonSchema, null, 2)}
                            onChange={(value) => {
                                try {
                                    setSchema(JSON.parse(value));
                                } catch {}
                            }}
                        />
                    </MonacoContainer>
                </Flex>
                <Flex direction="column" gap="4" grow>
                    <Example schema={schema} title="With correct value" value={correctValue} />
                    <Example
                        schema={schema}
                        submitOnMount
                        title="With incorrect value"
                        value={incorrectValue}
                    />
                    <Example schema={schema} title="With empty value" value={emptyValue} />
                </Flex>
            </Flex>
        </Flex>
    );
};
