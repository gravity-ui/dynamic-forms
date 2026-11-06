import React from 'react';

import {useForm} from 'react-final-form';

import {
    type AddExternalErrorsParams,
    type AddSchemaPatchesParams,
    type RemoveExternalErrorsParams,
    type RemoveSchemaPatchesParams,
    type UpdateUserContextParams,
    addExternalErrors,
    addSchemaPatches,
    removeExternalErrors,
    removeSchemaPatches,
    updateUserContext,
} from './utils';

export const useSchemaRendererTools = () => {
    const form = useForm();

    const tools = React.useMemo(
        () => ({
            addExternalErrors: ({
                headName,
                priorityErrors,
                regularErrors,
            }: Omit<AddExternalErrorsParams, 'form'>) =>
                addExternalErrors({form, headName, priorityErrors, regularErrors}),
            addSchemaPatches: ({patches}: Omit<AddSchemaPatchesParams, 'form'>) =>
                addSchemaPatches({form, patches}),
            removeExternalErrors: ({
                headName,
                removeFunctionOrNames,
            }: Omit<RemoveExternalErrorsParams, 'form'>) =>
                removeExternalErrors({form, headName, removeFunctionOrNames}),
            removeSchemaPatches: ({patchesToRemove}: Omit<RemoveSchemaPatchesParams, 'form'>) =>
                removeSchemaPatches({form, patchesToRemove}),
            updateUserContext: ({
                headName,
                userContext,
                replace,
            }: Omit<UpdateUserContextParams, 'form'>) =>
                updateUserContext({form, headName, userContext, replace}),
        }),
        [form],
    );

    return tools;
};
