import {FormValue, Spec} from '../../../types';

import {BaseValidateError} from './';

export interface DynamicFormMutators {
    errors?: Record<string, BaseValidateError>;
    values?: Record<string, FormValue>;
    spec?: Record<string, Partial<Spec>>;
}
