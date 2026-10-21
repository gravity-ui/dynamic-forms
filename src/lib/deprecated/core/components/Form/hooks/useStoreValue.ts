import {useDynamicFormsCtx} from './useDynamicFormsCtx';

/** @deprecated Use the SchemaRenderer API. */
export const useStoreValue = () => useDynamicFormsCtx().store;
