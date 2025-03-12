import type {
    ArraySpec,
    BooleanSpec,
    FormValue,
    NumberSpec,
    ObjectSpec,
    StringSpec,
} from '../../../types';

import type {BaseValidateError} from './';

export type SpecMutator = Partial<
    | (Omit<ArraySpec, 'viewSpec'> & {viewSpec: Partial<ArraySpec['viewSpec']>})
    | (Omit<BooleanSpec, 'viewSpec'> & {viewSpec: Partial<BooleanSpec['viewSpec']>})
    | (Omit<NumberSpec, 'viewSpec'> & {viewSpec: Partial<NumberSpec['viewSpec']>})
    | (Omit<ObjectSpec, 'viewSpec'> & {viewSpec: Partial<ObjectSpec['viewSpec']>})
    | (Omit<StringSpec, 'viewSpec'> & {viewSpec: Partial<StringSpec['viewSpec']>})
>;

export interface DynamicFormMutators {
    errors?: Record<string, BaseValidateError>;
    values?: Record<string, FormValue>;
    spec?: Record<string, SpecMutator>;
}

export interface DynamicFormMutatorsStore {
    errors?: Record<string, {value: BaseValidateError}>;
    values?: Record<string, {value: FormValue}>;
    spec?: Record<string, {value: SpecMutator}>;
}
