export enum SpecTypes {
    Array = 'array',
    Boolean = 'boolean',
    Number = 'number',
    Object = 'object',
    String = 'string',
}

export type ReadAsMethod =
    | 'readAsArrayBuffer'
    | 'readAsBinaryString'
    | 'readAsDataURL'
    | 'readAsText';
