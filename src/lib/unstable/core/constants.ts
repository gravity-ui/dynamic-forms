export enum SchemaRendererMode {
    Form = 'form',
    Overview = 'overview',
}

export enum SchemaRendererEventType {
    Config = 'config',
    Error = 'error',
    ErrorMessages = 'errorMessages',
    Mode = 'mode',
    Name = 'name',
    Patch = 'patch',
    Schema = 'schema',
    UserContext = 'userContext',
}

export enum JsonSchemaType {
    Array = 'array',
    Boolean = 'boolean',
    Integer = 'integer',
    Null = 'null',
    Number = 'number',
    Object = 'object',
    String = 'string',
}

export enum NodeType {
    Any = 'any',
    Array = 'array',
    Boolean = 'boolean',
    Number = 'number',
    Object = 'object',
    String = 'string',
}

export const EMPTY_OBJECT = {};
