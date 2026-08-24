import {type FormApi} from 'final-form';

import {getServiceFieldName} from '../../utils';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../constants';

export const getRunValidate = (form: FormApi, headName: string, validateOnBlur: boolean) => {
    const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);

    return () => {
        if (validateOnBlur) {
            form.blur(srName);
        } else {
            form.setConfig('validateOnBlur', true);
            form.blur(srName);
            form.setConfig('validateOnBlur', false);
        }
    };
};
