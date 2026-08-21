import type {FormApi} from 'final-form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';

import type {SchemaRendererNodeState} from '../../SchemaRendererNode';
import {SchemaRendererEventType} from '../../constants';
import type {JsonSchema} from '../../types';
import {
    SCHEMA_RENDERER_SERVICE_FIELD,
    type SchemaPatch,
    type SchemaPatchRemover,
    type SchemaRendererState,
} from '../../useSchemaRenderer';
import {
    getSchemaByPointer,
    getServiceFieldName,
    getValuePaths,
    pointerToArrayPath,
} from '../../utils';

export interface AddSchemaPatchesParams {
    form: FormApi;
    patches: SchemaPatch[];
}

export const addSchemaPatches = ({form, patches}: AddSchemaPatchesParams) => {
    const changesByHeadName: Record<string, string[][]> = {};

    patches.forEach((p) => {
        let schemaPath: string | undefined;

        if ('schemaPath' in p) {
            schemaPath = p.schemaPath;
        } else {
            const nodeField = form.getFieldState(p.name);
            const nodeState: SchemaRendererNodeState | undefined = nodeField?.data?.state;

            schemaPath = nodeState?.schemaPath;
        }

        if (schemaPath !== undefined) {
            const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, p.headName);
            const srField = form.getFieldState(srName);
            const srState: SchemaRendererState | undefined = srField?.data?.state;

            if (srState) {
                const schemaArrPath = pointerToArrayPath(schemaPath);
                const valuePaths = getValuePaths(p.schema);
                const changedPaths: string[][] = [];

                if (p.replace) {
                    [
                        ...valuePaths,
                        ...getValuePaths(getSchemaByPointer(srState.schema, schemaArrPath)),
                    ].forEach((path) => {
                        const current = get(srState.schema, [...schemaArrPath, ...path]);
                        const next = get(p.schema, path);

                        if (!isEqual(current, next)) {
                            changedPaths.push(['#', ...schemaArrPath, ...path]);
                        }
                    });

                    if (schemaArrPath.length) {
                        set(srState.schema, schemaArrPath, p.schema);
                    } else {
                        srState.schema = p.schema;
                    }
                } else {
                    valuePaths.forEach((path) => {
                        const current = get(srState.schema, [...schemaArrPath, ...path]);
                        const next = get(p.schema, path);

                        if (!isEqual(current, next)) {
                            set(srState.schema, [...schemaArrPath, ...path], next);

                            changedPaths.push(['#', ...schemaArrPath, ...path]);
                        }
                    });
                }

                srState.patches = [...srState.patches, p];

                if (changedPaths.length) {
                    changesByHeadName[p.headName] = [
                        ...(changesByHeadName[p.headName] || []),
                        ...changedPaths,
                    ];
                }
            }
        }
    });

    Object.entries(changesByHeadName).forEach(([headName, paths]) => {
        const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState | undefined = srField?.data?.state;

        if (srState) {
            srState.schema = {...srState.schema};
            srState.dispatchEvent([{type: SchemaRendererEventType.Patch, paths}]);
            srState.runValidate();
        }
    });
};

export interface RemoveSchemaPatchesParams {
    form: FormApi;
    patchesToRemove: SchemaPatchRemover[];
}

export const removeSchemaPatches = ({form, patchesToRemove}: RemoveSchemaPatchesParams) => {
    const patchesByHeadName: Record<string, SchemaPatchRemover[]> = {};

    patchesToRemove.forEach((p) => {
        let schemaPath: string | undefined;

        if ('schemaPath' in p) {
            schemaPath = p.schemaPath;
        } else {
            const nodeField = form.getFieldState(p.name);
            const nodeState: SchemaRendererNodeState | undefined = nodeField?.data?.state;

            schemaPath = nodeState?.schemaPath;
        }

        if (schemaPath !== undefined) {
            patchesByHeadName[p.headName] = [...(patchesByHeadName[p.headName] || []), p];
        }
    });

    Object.entries(patchesByHeadName).forEach(([headName, patchesToRemove]) => {
        const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState | undefined = srField?.data?.state;

        if (srState) {
            let schemaPatch: JsonSchema = {};

            srState.patches.forEach((p) => {
                let schemaPath: string | undefined;

                if ('schemaPath' in p) {
                    schemaPath = p.schemaPath;
                } else {
                    const nodeField = form.getFieldState(p.name);
                    const nodeState: SchemaRendererNodeState | undefined = nodeField?.data?.state;

                    schemaPath = nodeState?.schemaPath;
                }

                if (schemaPath) {
                    const schemaArrPath = pointerToArrayPath(schemaPath);

                    if (schemaArrPath.length) {
                        set(
                            schemaPatch,
                            schemaArrPath,
                            cloneDeep(get(srState.originalSchema, schemaArrPath)),
                        );
                    } else {
                        schemaPatch = cloneDeep(srState.originalSchema);
                    }
                }
            });

            const patches = srState.patches.filter((p) => {
                let pSchemaPath: string | undefined;

                if ('schemaPath' in p) {
                    pSchemaPath = p.schemaPath;
                } else {
                    const nodeField = form.getFieldState(p.name);
                    const nodeState: SchemaRendererNodeState | undefined = nodeField?.data?.state;

                    pSchemaPath = nodeState?.schemaPath;
                }

                const shouldRemove = patchesToRemove.some((ptr) => {
                    let ptrSchemaPath: string | undefined;

                    if ('schemaPath' in ptr) {
                        ptrSchemaPath = ptr.schemaPath;
                    } else {
                        const nodeField = form.getFieldState(ptr.name);
                        const nodeState: SchemaRendererNodeState | undefined =
                            nodeField?.data?.state;

                        ptrSchemaPath = nodeState?.schemaPath;
                    }

                    if (
                        pSchemaPath &&
                        ptrSchemaPath &&
                        pSchemaPath === ptrSchemaPath &&
                        (isEqual(p.schema, ptr.schema) || ptr.schema === true)
                    ) {
                        return true;
                    }

                    return false;
                });

                if (!shouldRemove && pSchemaPath) {
                    const schemaArrPath = pointerToArrayPath(pSchemaPath);

                    if (schemaArrPath.length) {
                        set(schemaPatch, schemaArrPath, p.schema);
                    } else {
                        schemaPatch = p.schema;
                    }
                }

                return !shouldRemove;
            });

            addSchemaPatches({form, patches: [{headName, schemaPath: '#', schema: schemaPatch}]});

            srState.patches = patches;
        }
    });
};
