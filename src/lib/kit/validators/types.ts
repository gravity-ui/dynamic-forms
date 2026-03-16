export interface ErrorMessagesType {
    REQUIRED: string;
    INVALID: string;
    INT: string;
    NUMBER: string;
    minLength: (count: number | bigint) => string;
    minLengthArr: (count: number | bigint) => string;
    maxLength: (count: number | bigint) => string;
    maxLengthArr: (count: number | bigint) => string;
    minNumber: (count: number | bigint) => string;
    maxNumber: (count: number | bigint) => string;
    SPACE_START: string;
    SPACE_END: string;
    DOT_END: string;
    ZERO_START: string;
    INVALID_ZERO_FORMAT: string;
    ZERO_END: string;
}
