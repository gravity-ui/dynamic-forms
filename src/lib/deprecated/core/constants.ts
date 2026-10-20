/** @deprecated Use JsonSchemaType from @gravity-ui/dynamic-forms for new forms. */
export enum SpecTypes {
    Array = 'array',
    Boolean = 'boolean',
    Number = 'number',
    Object = 'object',
    String = 'string',
}

/** @deprecated Use the SchemaRenderer API. */
export type ReadAsMethod =
    | 'readAsArrayBuffer'
    | 'readAsBinaryString'
    | 'readAsDataURL'
    | 'readAsText';
