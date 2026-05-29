import {ENTITY_SERVICE_FIELD} from '../../constants';

import type {SetArrayObjectErrorsFunction} from './types';

export const setArrayObjectErrors: SetArrayObjectErrorsFunction = (
    [{headName, arrayAndObjectErrors}],
    mutableState,
) => {
    const entityField = mutableState.fields[ENTITY_SERVICE_FIELD];
    const field = mutableState.fields[headName];

    if (field && entityField) {
        field.data = {
            ...field.data,
            arrayAndObjectErrors,
        };
        entityField.data = {
            ...entityField.data,
            arrayAndObjectErrors,
        };
    }
};
