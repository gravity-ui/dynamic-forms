import type {ErrorObject} from 'ajv';
import type {FormApi} from 'final-form';
import get from 'lodash/get';
import isString from 'lodash/isString';

import type {ErrorMessages, JsonSchema, ValidationError} from '../../types';
import {getSchemaBySchemaPath} from '../../utils';

export interface ProcessAjvErrorParams<Schema extends JsonSchema> {
    error: ErrorObject;
    errorMessages?: ErrorMessages;
    form: FormApi;
    nameFromRoot: string;
    schema: Schema;
    onError: (error: ValidationError) => void;
}

export const processAjvError = <Schema extends JsonSchema>({
    error,
    errorMessages,
    form,
    nameFromRoot,
    schema,
    onError,
}: ProcessAjvErrorParams<Schema>) => {
    let instancePath = error.instancePath;
    let keyword = error.keyword;
    let schemaPath = error.schemaPath;

    if (schemaPath.endsWith(`stringNumber`)) {
        schemaPath = schemaPath.slice(0, -`stringNumber`.length) + keyword;
    }

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
            `nodeParameters.errorMessages.${keyword}`,
        );
        const message: string | undefined = isString(errorOrMap)
            ? errorOrMap
            : get(errorOrMap, propertyName);

        return message;
    };

    const schemaPathByName = form.getFieldState(nameFromRoot)?.data?.state?.schemaPath;

    onError(
        // case when keyword in schema path is the schema
        getErrorMessageBySchema(getSchemaBySchemaPath(schema, schemaPath)) ||
            // case when keyword in schema path is not the schema
            (schemaPath.endsWith(`/${keyword}`) &&
                getErrorMessageBySchema(
                    getSchemaBySchemaPath(schema, schemaPath.slice(0, -`/${keyword}`.length)),
                )) ||
            getErrorMessageBySchema(schemaPathByName) ||
            errorMessages?.[keyword as keyof typeof errorMessages] ||
            error.message,
    );
};
