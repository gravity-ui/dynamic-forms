import React from 'react';

import {
    type JsonSchemaObject,
    type NodeEntity,
    type NodesConfig,
    SchemaRendererEventType,
    SchemaRendererNodeContext,
    createSchemaRendererNodeContextRuler,
    getRenderKit,
    useSchemaRendererState,
} from '../../../core';
import {EntityContainer} from '../../components';
import {block} from '../../utils';
import {ObjectEntity, type ObjectEntityProps} from '../ObjectEntity';

import './StructureBuilder.scss';

const b = block('structure-builder');

type StructureBuilderItem =
    | {children: StructureBuilderItem[]; schema: JsonSchemaObject}
    | {schemaPath: string};

export interface StructureBuilderProps extends ObjectEntityProps {
    structure?: StructureBuilderItem[];
}

export const StructureBuilder: NodeEntity<JsonSchemaObject, StructureBuilderProps> = (props) => {
    const {
        Layout,
        headName,
        input,
        layoutProps,
        meta,
        mode,
        props: entityProps,
        schema,
        schemaPath,
        settings,
    } = props;

    const {structure, ...restEntityProps} = React.useMemo(() => entityProps, [entityProps]);

    const [ready, setReady] = React.useState(false);

    const srState = useSchemaRendererState({
        headName,
        subscriptions: [SchemaRendererEventType.Config],
    });

    const parseItem = React.useCallback(
        (item: StructureBuilderItem, config?: NodesConfig) => {
            if ('schemaPath' in item) {
                return (
                    <div
                        className={b('mirror')}
                        data-sr-mirror={`${srState?.instanceId}::${schemaPath}${item.schemaPath}`}
                    />
                );
            }

            const kit = getRenderKit({config, schema: item.schema})[mode];
            const children = item.children.map((i) => parseItem(i, config));

            if (kit.Layout && children.length) {
                const fakeInput = {
                    name: input.name,
                    onBlur: () => {},
                    onChange: () => {},
                    onFocus: () => {},
                    value: {},
                };
                const fakeMeta = {};

                const nodeContextRuler = createSchemaRendererNodeContextRuler({
                    headName,
                    input: fakeInput,
                    meta: fakeMeta,
                    mode,
                    name: input.name,
                    parentValueEmpty: false,
                    schema: item.schema,
                    schemaPath,
                    settings,
                });

                return (
                    <SchemaRendererNodeContext.Provider value={nodeContextRuler}>
                        <kit.Layout
                            headName={headName}
                            input={fakeInput}
                            meta={fakeMeta}
                            mode={mode}
                            props={kit.layoutProps || {}}
                            schema={item.schema}
                            schemaPath={schemaPath}
                            settings={settings}
                        >
                            {children}
                        </kit.Layout>
                    </SchemaRendererNodeContext.Provider>
                );
            }

            return null;
        },
        [headName, mode, input.name, schemaPath, settings, srState?.instanceId],
    );

    const content = React.useMemo(
        () => structure?.map((el) => parseItem(el, srState?.config)),
        [parseItem, srState?.config, structure],
    );

    React.useLayoutEffect(() => {
        if (ready) {
            setReady(false);
        }
    }, [structure]);

    React.useLayoutEffect(() => {
        setReady(true);
    }, [ready]);

    let result = null;

    if (content) {
        result = (
            <EntityContainer width="by-child" fill="by-child" droppable>
                {content}
                {ready ? <ObjectEntity {...props} props={restEntityProps} /> : null}
            </EntityContainer>
        );
    }

    if (Layout && result) {
        result = (
            <Layout
                headName={headName}
                input={input}
                meta={meta}
                mode={mode}
                props={layoutProps || {}}
                schema={schema}
                schemaPath={schemaPath}
                settings={settings}
            >
                {result}
            </Layout>
        );
    }

    return result;
};
