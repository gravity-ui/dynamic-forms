import {useDynamicFormsCtx} from './useDynamicFormsCtx';

export const useFormShared = <SharedStore extends Record<string, any>>() =>
    useDynamicFormsCtx().shared as {
        store: SharedStore;
        onChangeShared: <Name extends keyof SharedStore, Value extends SharedStore[Name]>(
            name: Name,
            value: Value,
        ) => void;
    };
