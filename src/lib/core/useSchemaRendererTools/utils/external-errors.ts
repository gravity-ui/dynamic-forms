import type {FormApi} from 'final-form';
import omit from 'lodash/omit';

import type {ValidationError} from '../../types';
import {SCHEMA_RENDERER_SERVICE_FIELD, type SchemaRendererState} from '../../useSchemaRenderer';
import {getServiceFieldName} from '../../utils';

export interface AddExternalErrorsParams {
    form: FormApi;
    headName: string;
    priorityErrors?: Record<string, ValidationError>;
    regularErrors?: Record<string, ValidationError>;
}

export const addExternalErrors = ({
    form,
    headName,
    priorityErrors,
    regularErrors,
}: AddExternalErrorsParams) => {
    const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);
    const srField = form.getFieldState(srName);
    const srState: SchemaRendererState | undefined = srField?.data?.state;

    if (srState && (priorityErrors || regularErrors)) {
        srState.priorityErrors = {...srState.priorityErrors, ...priorityErrors};
        srState.regularErrors = {...srState.regularErrors, ...regularErrors};

        srState.runValidate();
    }
};

export interface RemoveExternalErrorsParams {
    form: FormApi;
    headName: string;
    removeFunctionOrNames:
        | string[]
        | ((
              priorityErrors: Record<string, ValidationError>,
              regularErrors: Record<string, ValidationError>,
          ) => {
              priorityErrors: Record<string, ValidationError>;
              regularErrors: Record<string, ValidationError>;
          });
}

export const removeExternalErrors = ({
    form,
    headName,
    removeFunctionOrNames,
}: RemoveExternalErrorsParams) => {
    const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);
    const srField = form.getFieldState(srName);
    const srState: SchemaRendererState | undefined = srField?.data?.state;

    if (srState && removeFunctionOrNames) {
        if (Array.isArray(removeFunctionOrNames)) {
            srState.priorityErrors = omit(srState.priorityErrors, removeFunctionOrNames);
            srState.regularErrors = omit(srState.regularErrors, removeFunctionOrNames);
        } else {
            const {priorityErrors, regularErrors} = removeFunctionOrNames(
                {...srState.priorityErrors},
                {...srState.regularErrors},
            );

            srState.priorityErrors = priorityErrors;
            srState.regularErrors = regularErrors;
        }

        srState.runValidate();
    }
};
