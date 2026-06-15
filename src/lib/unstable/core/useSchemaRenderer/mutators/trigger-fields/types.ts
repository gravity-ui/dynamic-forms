import type {MutableState, Tools} from 'final-form';

export interface TriggerFieldsParams {
    fields: string[];
}

export type TriggerFieldsFunction<FormValues = object, InitialFormValues = Partial<FormValues>> = (
    args: [TriggerFieldsParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type TriggerFieldsMutator = (params: TriggerFieldsParams) => void;
