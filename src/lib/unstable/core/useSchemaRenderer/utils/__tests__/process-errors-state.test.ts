import type {ExternalErrorsState} from '../../mutators';
import {processErrorsState} from '../process-errors-state';

import {FIELD_NAME} from './fixtures.test';

describe('processErrorsState', () => {
    test('processes errors state', () => {
        const prefix = 'prefix';
        const errorsState: ExternalErrorsState = {
            priorityErrors: {
                [`${prefix}.${FIELD_NAME}`]: 'priority-error',
                [`${prefix}.${FIELD_NAME}.name`]: 'name-error',
                [`${prefix}.${FIELD_NAME}.surname`]: 'surname-error',
            },
            regularErrors: {
                [`${prefix}.${FIELD_NAME}`]: 'regular-error',
                [`${prefix}.${FIELD_NAME}.name`]: 'name-error',
                [`${prefix}.${FIELD_NAME}.surname`]: 'surname-error',
            },
        };

        const result = processErrorsState({errorsState, name: prefix});

        expect(result).toEqual({
            externalRegularErrorItems: [
                {path: [FIELD_NAME], error: 'regular-error'},
                {path: [FIELD_NAME, 'name'], error: 'name-error'},
                {path: [FIELD_NAME, 'surname'], error: 'surname-error'},
            ],
            externalPriorityErrorItems: [
                {path: [FIELD_NAME], error: 'priority-error'},
                {path: [FIELD_NAME, 'name'], error: 'name-error'},
                {path: [FIELD_NAME, 'surname'], error: 'surname-error'},
            ],
        });
    });

    test('processes errors state has no prefix (schema renderer root)', () => {
        const errorsState: ExternalErrorsState = {
            priorityErrors: {
                [`${FIELD_NAME}`]: 'priority-error',
                [`${FIELD_NAME}.name`]: 'name-error',
                [`${FIELD_NAME}.surname`]: 'surname-error',
            },
            regularErrors: {
                [`${FIELD_NAME}`]: 'regular-error',
                [`${FIELD_NAME}.name`]: 'name-error',
                [`${FIELD_NAME}.surname`]: 'surname-error',
            },
        };

        const result = processErrorsState({errorsState, name: FIELD_NAME});

        expect(result).toEqual({
            externalRegularErrorItems: [
                {path: [], error: 'regular-error'},
                {path: ['name'], error: 'name-error'},
                {path: ['surname'], error: 'surname-error'},
            ],
            externalPriorityErrorItems: [
                {path: [], error: 'priority-error'},
                {path: ['name'], error: 'name-error'},
                {path: ['surname'], error: 'surname-error'},
            ],
        });
    });

    test('processes errors state with no errors', () => {
        const errorsState: ExternalErrorsState = {};
        const prefix = 'prefix';

        const result = processErrorsState({errorsState, name: prefix});

        expect(result).toEqual({externalPriorityErrorItems: [], externalRegularErrorItems: []});
    });
});
