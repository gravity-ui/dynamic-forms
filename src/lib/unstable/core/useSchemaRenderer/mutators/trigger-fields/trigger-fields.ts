import type {TriggerFieldsFunction} from './types';

export const triggerFields: TriggerFieldsFunction = ([{fields}], mutableState) => {
    fields.forEach((fieldName) => {
        const field = mutableState.fields[fieldName];

        if (field) {
            field.data = {...field.data, count: (field.data.count || 0) + 1};
        }
    });
};
