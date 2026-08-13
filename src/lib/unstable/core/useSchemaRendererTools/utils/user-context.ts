import type {FormApi} from 'final-form';

import {SchemaRendererEventType} from '../../constants';
import {SCHEMA_RENDERER_SERVICE_FIELD, type SchemaRendererState} from '../../useSchemaRenderer';
import {getServiceFieldName} from '../../utils';

export interface UpdateUserContextParams {
    form: FormApi;
    headName: string;
    userContext: SchemaRendererState['userContext'];
    replace?: boolean;
}

export const updateUserContext = ({
    form,
    headName,
    userContext,
    replace = false,
}: UpdateUserContextParams) => {
    const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);
    const srField = form.getFieldState(srName);
    const srState: SchemaRendererState | undefined = srField?.data?.state;

    if (srState) {
        srState.userContext = replace ? userContext : {...srState.userContext, ...userContext};

        srState.dispatchEvent([{type: SchemaRendererEventType.UserContext, all: true}]);
    }
};
