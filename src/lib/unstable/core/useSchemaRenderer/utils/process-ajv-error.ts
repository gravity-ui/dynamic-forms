import type {ErrorObject} from 'ajv';
import get from 'lodash/get';
import isString from 'lodash/isString';

import type {ErrorMessages, JsonSchema} from '../../types';
import type {ValidateErrorItem} from '../types';

import {getSchemaByInstancePath, getSchemaBySchemaPath, parseInstancePath} from './common';

export interface ProcessAjvErrorParams<Schema extends JsonSchema> {
    error: ErrorObject;
    errorMessages: ErrorMessages;
    schema: Schema;
    onError: (error: ValidateErrorItem) => void;
}

export const processAjvError = <Schema extends JsonSchema>({
    error,
    errorMessages,
    schema,
    onError,
}: ProcessAjvErrorParams<Schema>) => {
    let instancePath = error.instancePath;
    let keyword = error.keyword;
    let schemaPath = error.schemaPath;

    if (
        keyword === 'anyOf' ||
        (keyword === 'if' &&
            (error.params.failingKeyword === 'then' || error.params.failingKeyword === 'else')) ||
        keyword === 'false schema'
    ) {
        return;
    }

    if (error.propertyName) {
        instancePath += `/${error.propertyName}`;
    }

    if (keyword === 'required') {
        instancePath += `/${error.params.missingProperty}`;
    } else if (keyword === 'dependencies') {
        instancePath += `/${error.params.missingProperty}`;
        schemaPath =
            schemaPath.slice(0, -'dependencies'.length) +
            `properties/${error.params.missingProperty}/dependencies`;
    } else if (keyword === 'if') {
        keyword = error.params.failingKeyword;
        schemaPath = schemaPath.slice(0, -'if'.length) + error.params.failingKeyword;
    }

    const getErrorMessageBySchema = (schema: JsonSchema | undefined) => {
        const propertyName = instancePath.split('/').pop() as string;
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
        path: parseInstancePath(instancePath),
        error:
            getErrorMessageBySchema(getSchemaBySchemaPath(schemaPath, schema)) ||
            getErrorMessageBySchema(
                getSchemaBySchemaPath(schemaPath.slice(0, -`/${keyword}`.length), schema),
            ) ||
            getErrorMessageBySchema(getSchemaByInstancePath(instancePath, schema)) ||
            errorMessages[keyword as keyof typeof errorMessages] ||
            error.message,
    });
};
