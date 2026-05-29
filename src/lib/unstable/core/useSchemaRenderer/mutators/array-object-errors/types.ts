import type {MutableState, Tools} from 'final-form';

import type {SyncValidateError} from '../../../types';

export interface ArrayObjectErrorsState {
    arrayAndObjectErrors?: {[key: string]: SyncValidateError};
}

export interface SetArrayObjectErrorsParams {
    headName: string;
    arrayAndObjectErrors: {[key: string]: SyncValidateError};
}

export type SetArrayObjectErrorsFunction<
    FormValues = object,
    InitialFormValues = Partial<FormValues>,
> = (
    args: [SetArrayObjectErrorsParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type SetArrayObjectErrorsMutator = (params: SetArrayObjectErrorsParams) => void;
