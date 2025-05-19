import mapValues from 'lodash/mapValues';

import type {ErrorsState} from '../../mutators';
import {parseFinalFormPath} from '../../utils';
import type {ValidateErrorItem} from '../types';

interface ProcessErrorsStateParams {
    errorsState: ErrorsState | undefined;
}

interface ProcessErrorsStateReturn {
    externalPriorityErrorItems: ValidateErrorItem[];
    externalRegularErrorItems: ValidateErrorItem[];
}

export const processErrorsState = ({
    errorsState,
}: ProcessErrorsStateParams): ProcessErrorsStateReturn => {
    const getErrorItems = (errors: ErrorsState['priorityErrors'] | ErrorsState['regularErrors']) =>
        Object.values(
            mapValues(errors, (value, key) => ({
                path: parseFinalFormPath(key),
                error: value,
            })),
        );

    return {
        externalPriorityErrorItems: getErrorItems(errorsState?.priorityErrors),
        externalRegularErrorItems: getErrorItems(errorsState?.regularErrors),
    };
};
