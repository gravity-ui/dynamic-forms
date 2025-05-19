import {processErrorsState} from '../process-errors-state';

describe('processErrorsState', () => {
    it('should return empty arrays when errorsState is undefined', () => {
        const result = processErrorsState({
            errorsState: undefined,
        });

        expect(result.externalPriorityErrorItems).toEqual([]);
        expect(result.externalRegularErrorItems).toEqual([]);
    });

    it('should process priorityErrors correctly', () => {
        const result = processErrorsState({
            errorsState: {
                priorityErrors: {
                    field1: 'Error 1',
                    field2: true,
                },
                regularErrors: {},
            },
        });

        expect(result.externalPriorityErrorItems).toEqual([
            {path: ['field1'], error: 'Error 1'},
            {path: ['field2'], error: true},
        ]);
        expect(result.externalRegularErrorItems).toEqual([]);
    });

    it('should process regularErrors correctly', () => {
        const result = processErrorsState({
            errorsState: {
                priorityErrors: {},
                regularErrors: {
                    field3: 'Error 3',
                    field4: {
                        nested: 'Nested error',
                    },
                },
            },
        });

        expect(result.externalPriorityErrorItems).toEqual([]);
        expect(result.externalRegularErrorItems).toEqual([
            {path: ['field3'], error: 'Error 3'},
            {path: ['field4'], error: {nested: 'Nested error'}},
        ]);
    });

    it('should process both priorityErrors and regularErrors correctly', () => {
        const result = processErrorsState({
            errorsState: {
                priorityErrors: {
                    field1: 'Error 1',
                    field2: true,
                },
                regularErrors: {
                    field3: 'Error 3',
                    field4: {
                        nested: 'Nested error',
                    },
                },
            },
        });

        expect(result.externalPriorityErrorItems).toEqual([
            {path: ['field1'], error: 'Error 1'},
            {path: ['field2'], error: true},
        ]);
        expect(result.externalRegularErrorItems).toEqual([
            {path: ['field3'], error: 'Error 3'},
            {path: ['field4'], error: {nested: 'Nested error'}},
        ]);
    });

    it('should handle complex paths correctly', () => {
        const result = processErrorsState({
            errorsState: {
                priorityErrors: {
                    'parent.child': 'Nested error',
                },
                regularErrors: {
                    'array[0]': 'Array error',
                },
            },
        });

        expect(result.externalPriorityErrorItems).toEqual([
            {path: ['parent', 'child'], error: 'Nested error'},
        ]);
        expect(result.externalRegularErrorItems).toEqual([
            {path: ['array', '0'], error: 'Array error'},
        ]);
    });

    it('should handle undefined priorityErrors and regularErrors', () => {
        const result = processErrorsState({
            errorsState: {},
        });

        expect(result.externalPriorityErrorItems).toEqual([]);
        expect(result.externalRegularErrorItems).toEqual([]);
    });

    it('should handle various error types correctly', () => {
        const result = processErrorsState({
            errorsState: {
                priorityErrors: {
                    string: 'String error',
                    boolean: true,
                    object: {key: 'value'},
                    array: ['item1', 'item2'],
                    undefined: undefined,
                },
                regularErrors: {},
            },
        });

        expect(result.externalPriorityErrorItems).toEqual([
            {path: ['string'], error: 'String error'},
            {path: ['boolean'], error: true},
            {path: ['object'], error: {key: 'value'}},
            {path: ['array'], error: ['item1', 'item2']},
            {path: ['undefined'], error: undefined},
        ]);
    });
});
