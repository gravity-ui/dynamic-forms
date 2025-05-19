import type {ErrorObject} from 'ajv';
import get from 'lodash/get';
import isString from 'lodash/isString';

import {EMPTY_OBJECT} from '../../constants';
import type {ErrorMessages, JsonSchema} from '../../types';
import {parseFinalFormPath} from '../../utils';
import type {ValidateErrorItem} from '../types';

import {getSchemaByInstancePath, getSchemaBySchemaPath, parseInstancePath} from './common';

interface ProcessAjvErrorParams<Schema extends JsonSchema> {
    error: ErrorObject;
    errorMessages: ErrorMessages | undefined;
    headName: string;
    mainSchema: Schema;
    onError: (error: ValidateErrorItem) => void;
}

export const processAjvError = <Schema extends JsonSchema>({
    error,
    errorMessages = EMPTY_OBJECT,
    headName,
    mainSchema,
    onError,
}: ProcessAjvErrorParams<Schema>) => {
    let instancePath = error.instancePath;
    let keyword = error.keyword;
    let schemaPath = error.schemaPath;

    if (keyword === 'required' || keyword === 'dependencies') {
        instancePath += `/${error.params.missingProperty}`;
    } else if (keyword === 'if') {
        keyword = error.params.failingKeyword;
        schemaPath = schemaPath.slice(0, -'if'.length) + error.params.failingKeyword;
    }

    const propertyName = instancePath.split('/').pop() as string;

    const getErrorMessageBySchema = (schema: JsonSchema | undefined) => {
        const errorOrMap: Record<string, string> | string | undefined = get(
            schema,
            `entityParameters.errorMessages.${keyword}`,
        );
        const message: string | undefined = isString(errorOrMap)
            ? errorOrMap
            : get(errorOrMap, propertyName);

        return message;
    };

    onError({
        path: [...parseFinalFormPath(headName), ...parseInstancePath(instancePath)],
        error:
            getErrorMessageBySchema(getSchemaBySchemaPath(schemaPath, mainSchema)) ||
            getErrorMessageBySchema(getSchemaByInstancePath(instancePath, mainSchema)) ||
            errorMessages[keyword as keyof typeof errorMessages] ||
            error.message,
    });
};
