import get from 'lodash/get';
import isString from 'lodash/isString';
import set from 'lodash/set';

import {EMPTY_OBJECT, type NodeType, SchemaRendererMode} from '../constants';
import type {JsonSchema, NodeEntity, NodeLayout, NodesConfig} from '../types';
import {fixType, getSchemaBySchemaPath, getValuePaths} from '../utils';

const mergeValues = (first?: object, second?: object) => {
    const result = {};

    getValuePaths(first).forEach((path) => {
        set(result, path, get(first, path));
    });

    getValuePaths(second).forEach((path) => {
        set(result, path, get(second, path));
    });

    return result;
};

type GetRenderKitParams<Schema extends JsonSchema> = {
    config?: NodesConfig;
    schema?: Schema;
};

type GetRenderKitReturn<Schema extends JsonSchema> = {
    [SchemaRendererMode.Form]: {
        Entity?: NodeEntity<Schema> | undefined;
        Layout?: NodeLayout<Schema> | undefined;
        entityProps: Record<string, any>;
        layoutProps: Record<string, any>;
        independent?: boolean | undefined;
    };
    [SchemaRendererMode.Overview]: {
        Entity?: NodeEntity<Schema> | undefined;
        Layout?: NodeLayout<Schema> | undefined;
        entityProps: Record<string, any>;
        layoutProps: Record<string, any>;
        independent?: boolean | undefined;
    };
};

// eslint-disable-next-line complexity
export const getRenderKit = <Schema extends JsonSchema>({
    config,
    schema,
}: GetRenderKitParams<Schema>): GetRenderKitReturn<Schema> => {
    const result: GetRenderKitReturn<Schema> = {
        [SchemaRendererMode.Form]: {
            entityProps: EMPTY_OBJECT,
            layoutProps: EMPTY_OBJECT,
        },
        [SchemaRendererMode.Overview]: {
            entityProps: EMPTY_OBJECT,
            layoutProps: EMPTY_OBJECT,
        },
    };

    const nodeType: NodeType | undefined = get(schema, 'nodeParameters.type');

    if (schema?.nodeParameters?.entity) {
        const e = schema?.nodeParameters?.entity;
        let fe: NodeEntity<Schema> | undefined;
        let fep = schema?.nodeParameters?.entityProps || EMPTY_OBJECT;
        let fi: boolean | undefined;
        let oe: NodeEntity<Schema> | undefined;
        let oep = schema?.nodeParameters?.entityProps || EMPTY_OBJECT;
        let oi: boolean | undefined;

        if (isString(e)) {
            fe = get(config, `${nodeType}.formEntities.${e}.Component`);
            fep = mergeValues(get(config, `${nodeType}.formEntities.${e}.defaultProps`), fep);
            fi = get(config, `${nodeType}.formEntities.${e}.independent`);
            oe = get(config, `${nodeType}.overviewEntities.${e}.Component`);
            oep = mergeValues(get(config, `${nodeType}.overviewEntities.${e}.defaultProps`), oep);
            oi = get(config, `${nodeType}.overviewEntities.${e}.independent`);
        } else {
            fe = fixType<NodeEntity<Schema> | undefined>(e);
            oe = fixType<NodeEntity<Schema> | undefined>(e);
        }

        result[SchemaRendererMode.Form].Entity = fe;
        result[SchemaRendererMode.Form].entityProps = fep;
        result[SchemaRendererMode.Form].independent = fi;
        result[SchemaRendererMode.Overview].Entity = oe;
        result[SchemaRendererMode.Overview].entityProps = oep;
        result[SchemaRendererMode.Overview].independent = oi;
    }

    if (schema?.nodeParameters?.formEntity) {
        const e = schema?.nodeParameters?.formEntity;
        let fe: NodeEntity<Schema> | undefined;
        let fep = schema?.nodeParameters?.formEntityProps || EMPTY_OBJECT;
        let fi: boolean | undefined;

        if (isString(e)) {
            fe = get(config, `${nodeType}.formEntities.${e}.Component`);
            fep = mergeValues(get(config, `${nodeType}.formEntities.${e}.defaultProps`), fep);
            fi = get(config, `${nodeType}.formEntities.${e}.independent`);
        } else {
            fe = fixType<NodeEntity<Schema> | undefined>(e);
        }

        result[SchemaRendererMode.Form].Entity = fe;
        result[SchemaRendererMode.Form].entityProps = fep;
        result[SchemaRendererMode.Form].independent = fi;
    }

    if (schema?.nodeParameters?.overviewEntity) {
        const e = schema?.nodeParameters?.overviewEntity;
        let oe: NodeEntity<Schema> | undefined;
        let oep = schema?.nodeParameters?.overviewEntityProps || EMPTY_OBJECT;
        let oi: boolean | undefined;

        if (isString(e)) {
            oe = get(config, `${nodeType}.overviewEntities.${e}.Component`);
            oep = mergeValues(get(config, `${nodeType}.overviewEntities.${e}.defaultProps`), oep);
            oi = get(config, `${nodeType}.overviewEntities.${e}.independent`);
        } else {
            oe = fixType<NodeEntity<Schema> | undefined>(e);
        }

        result[SchemaRendererMode.Overview].Entity = oe;
        result[SchemaRendererMode.Overview].entityProps = oep;
        result[SchemaRendererMode.Overview].independent = oi;
    }

    if (schema?.nodeParameters?.layout) {
        const l = schema?.nodeParameters?.layout;
        let fl: NodeLayout<Schema> | undefined;
        let flp = schema?.nodeParameters?.layoutProps || EMPTY_OBJECT;
        let ol: NodeLayout<Schema> | undefined;
        let olp = schema?.nodeParameters?.layoutProps || EMPTY_OBJECT;

        if (isString(l)) {
            fl = get(config, `${nodeType}.formLayouts.${l}.Component`);
            flp = mergeValues(get(config, `${nodeType}.formLayouts.${l}.defaultProps`), flp);
            ol = get(config, `${nodeType}.overviewLayouts.${l}.Component`);
            olp = mergeValues(get(config, `${nodeType}.overviewLayouts.${l}.defaultProps`), olp);
        } else {
            fl = fixType<NodeLayout<Schema> | undefined>(l);
            ol = fixType<NodeLayout<Schema> | undefined>(l);
        }

        result[SchemaRendererMode.Form].Layout = fl;
        result[SchemaRendererMode.Form].layoutProps = flp;
        result[SchemaRendererMode.Overview].Layout = ol;
        result[SchemaRendererMode.Overview].layoutProps = olp;
    }

    if (schema?.nodeParameters?.formLayout) {
        const l = schema?.nodeParameters?.formLayout;
        let fl: NodeLayout<Schema> | undefined;
        let flp = schema?.nodeParameters?.formLayoutProps || EMPTY_OBJECT;

        if (isString(l)) {
            fl = get(config, `${nodeType}.formLayouts.${l}.Component`);
            flp = mergeValues(get(config, `${nodeType}.formLayouts.${l}.defaultProps`), flp);
        } else {
            fl = fixType<NodeLayout<Schema> | undefined>(l);
        }

        result[SchemaRendererMode.Form].Layout = fl;
        result[SchemaRendererMode.Form].layoutProps = flp;
    }

    if (schema?.nodeParameters?.overviewLayout) {
        const l = schema?.nodeParameters?.overviewLayout;
        let ol: NodeLayout<Schema> | undefined;
        let olp = schema?.nodeParameters?.overviewLayoutProps || EMPTY_OBJECT;

        if (isString(l)) {
            ol = get(config, `${nodeType}.overviewLayouts.${l}.Component`);
            olp = mergeValues(get(config, `${nodeType}.overviewLayouts.${l}.defaultProps`), olp);
        } else {
            ol = fixType<NodeLayout<Schema> | undefined>(l);
        }

        result[SchemaRendererMode.Overview].Layout = ol;
        result[SchemaRendererMode.Overview].layoutProps = olp;
    }

    return result;
};

export const getAccumulatedSchema = (
    schemaPath: string,
    rootSchema?: JsonSchema,
    override?: JsonSchema,
) => {
    let accumulatedSchema: JsonSchema = {
        ...(rootSchema ? getSchemaBySchemaPath(rootSchema, schemaPath) : {}),
    };

    if (override) {
        accumulatedSchema = mergeValues(accumulatedSchema, override);
    }

    if (accumulatedSchema.$ref) {
        const schemaByRef = getAccumulatedSchema(accumulatedSchema.$ref, rootSchema);

        if (schemaByRef) {
            accumulatedSchema = mergeValues(accumulatedSchema, schemaByRef);
        }
    }

    return accumulatedSchema;
};
