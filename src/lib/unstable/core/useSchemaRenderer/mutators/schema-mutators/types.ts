import type {MutableState, Tools} from 'final-form';

import type {JsonSchema} from '../../../types';

export interface SchemaMutatorsState {
    mutators?: {name: string; schema: JsonSchema}[];
    originalSchema?: JsonSchema;
    schema?: JsonSchema;
}

export interface SetSchemaMutatorsParams {
    headName: string;
    mutators: {name: string; schema: JsonSchema}[];
}

export type SetSchemaMutatorsFunction<
    FormValues = object,
    InitialFormValues = Partial<FormValues>,
> = (
    args: [SetSchemaMutatorsParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type SetSchemaMutatorsMutator = (params: SetSchemaMutatorsParams) => void;

export interface RemoveSchemaMutatorsParams {
    headName: string;
    mutatorsToRemove: {name: string; schema: JsonSchema | true}[];
}

export type RemoveSchemaMutatorsFunction<
    FormValues = object,
    InitialFormValues = Partial<FormValues>,
> = (
    args: [RemoveSchemaMutatorsParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type RemoveSchemaMutatorsMutator = (params: RemoveSchemaMutatorsParams) => void;
