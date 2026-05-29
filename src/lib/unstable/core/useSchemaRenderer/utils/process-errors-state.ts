import mapValues from 'lodash/mapValues';

import type {ExternalErrorsState} from '../mutators';
import type {ValidateErrorItem} from '../types';

import {parseFinalFormName} from './common';

interface ProcessErrorsStateParams {
    errorsState: ExternalErrorsState | undefined;
    name: string;
}

interface ProcessErrorsStateReturn {
    externalPriorityErrorItems: ValidateErrorItem[];
    externalRegularErrorItems: ValidateErrorItem[];
}

export const processErrorsState = ({
    errorsState,
    name,
}: ProcessErrorsStateParams): ProcessErrorsStateReturn => {
    const getErrorItems = (
        errors:
            | ExternalErrorsState['priorityErrors']
            | ExternalErrorsState['regularErrors']
            | undefined,
    ) =>
        Object.values(
            mapValues(errors, (value, key) => ({
                path: parseFinalFormName(key).slice(parseFinalFormName(name).length),
                error: value,
            })),
        );

    return {
        externalPriorityErrorItems: getErrorItems(errorsState?.priorityErrors),
        externalRegularErrorItems: getErrorItems(errorsState?.regularErrors),
    };
};
