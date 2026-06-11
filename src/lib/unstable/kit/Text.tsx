import React from 'react';

import {
    PasswordInput,
    TextInput,
    type TextInputProps as TextInputBaseProps,
} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';

import {useSchemaRendererMutators} from '../core';
import type {ControlProps, JsonSchemaNumber, JsonSchemaString} from '../core/types';

export interface TextProps
    extends Omit<
        TextInputBaseProps,
        'value' | 'onBlur' | 'onFocus' | 'onUpdate' | 'disabled' | 'placeholder' | 'qa'
    > {}

const Component = <
    T extends ControlProps<JsonSchemaNumber, TextProps> | ControlProps<JsonSchemaString, TextProps>,
>({
    input,
    meta,
    schema,
}: T) => {
    // const {setErrors, removeErrors} = useSetErrors();
    const {setSchemaMutators} = useSchemaRendererMutators(); // setExternalErrors

    const props: TextInputBaseProps = {
        hasClear: true,
        // ...inputProps,
        value: isNil(input.value) ? '' : `${input.value}`,
        onBlur: input.onBlur,
        onFocus: input.onFocus,
        onUpdate: input.onChange,
        // disabled: spec.viewSpec.disabled,
        disabled: schema.readOnly,
        // placeholder: spec.viewSpec.placeholder,
        placeholder: `${schema.examples?.[0]}`,
        qa: input.name,
        error: meta.error,
        // errorMessage: meta.error,
    };

    React.useEffect(() => {
        if (input.name === 'qwe.test.jajaja.stringMaxLength') {
            // if (input.value === '1') {
            //     setExternalErrors?.({
            //         headName: 'qwe.test.jajaja',
            //         priorityErrors: {
            //             [input.name]: 'bbbbbbbbbbb priority',
            //             'qwe.test.jajaja': {
            //                 numberMaximum: 'bbbbbbbbbbb priority',
            //                 objectPropertyNames: {
            //                     stringEnum: 'bbbbbbbbbbb priority',
            //                 },
            //             },
            //             'qwe.test.jajaja.objectPropertyNames': 'bbbbbbbbbbb priority',
            //         },
            //     });
            //     setSchemaMutators?.({
            //         headName: 'qwe.test.jajaja',
            //         // mutators: {
            //         //     [input.name]: {
            //         //         title: 'Aaaaaaaa',
            //         //     },
            //         //     'qwe.test.jajaja.stringPattern': {
            //         //         title: 'OOOOOOO',
            //         //     },
            //         //     'qwe.test.jajaja.numberMinimum': {
            //         //         minimum: 0,
            //         //     },
            //         // },
            //         mutators: [
            //             {
            //                 name: input.name,
            //                 schema: {
            //                     title: 'QWEQWEQWEQWE',
            //                 },
            //             },
            //             {
            //                 name: 'qwe.test.jajaja.stringPattern',
            //                 schema: {
            //                     title: 'QWEQWEQWEQWE',
            //                 },
            //             },

            //             {
            //                 name: 'qwe.test.jajaja.numberMaximum',
            //                 schema: {
            //                     maximum: 10,
            //                 },
            //             },
            //         ],
            //     });
            // } else if (input.value === '2') {
            //     setExternalErrors?.({
            //         headName: 'qwe.test.jajaja',
            //         priorityErrors: {
            //             [input.name]: 'priorityError',
            //             'qwe.test.jajaja': {
            //                 numberMaximum: 'priorityError',
            //                 objectPropertyNames: {
            //                     stringEnum: 'priorityError',
            //                 },
            //             },
            //             'qwe.test.jajaja.objectPropertyNames': 'priorityError',
            //         },
            //     });
            //     setSchemaMutators?.({
            //         headName: 'qwe.test.jajaja',
            //         // mutators: {
            //         //     [input.name]: {
            //         //         title: 'Aaaaaaaa',
            //         //     },
            //         //     'qwe.test.jajaja.stringPattern': {
            //         //         title: 'OOOOOOO',
            //         //     },
            //         //     'qwe.test.jajaja.numberMinimum': {
            //         //         minimum: 0,
            //         //     },
            //         // },
            //         mutators: [
            //             {
            //                 name: input.name,
            //                 schema: {
            //                     title: 'Aaaaaaaa',
            //                 },
            //             },
            //             {
            //                 name: 'qwe.test.jajaja.stringPattern',
            //                 schema: {
            //                     title: 'OOOOOOO',
            //                 },
            //             },

            //             {
            //                 name: 'qwe.test.jajaja.numberMinimum',
            //                 schema: {
            //                     minimum: 0,
            //                 },
            //             },
            //         ],
            //     });
            // } else if (input.value === '3') {
            //     setExternalErrors?.({
            //         headName: 'qwe.test.jajaja',
            //         priorityErrors: {
            //             [input.name]: 'EXTERNAL_ERROR',
            //         },
            //     });
            //     removeSchemaMutators?.({
            //         headName: 'qwe.test.jajaja',
            //         // mutatorsToRemove: {
            //         //     'qwe.test.jajaja.numberMinimum': {
            //         //         minimum: 0,
            //         //     },
            //         //     'qwe.test.jajaja.stringPattern': true,
            //         // },
            //         mutatorsToRemove: [
            //             {
            //                 name: input.name,
            //                 schema: true,
            //             },
            //             {
            //                 name: 'qwe.test.jajaja.numberMinimum',
            //                 schema: {
            //                     minimum: 0,
            //                 },
            //             },
            //             {
            //                 name: 'qwe.test.jajaja.stringPattern',
            //                 schema: {
            //                     title: 'OOOOOOO',
            //                 },
            //             },
            //         ],
            //     });
            //     // removeExternalErrors?.({
            //     //     headName: 'qwe.test.jajaja',
            //     //     removeFunctionOrNames: [input.name],
            //     // });
            //     // removeExternalErrors?.({
            //     //     headName: 'qwe.test.jajaja',
            //     //     removeFunctionOrNames: (params) => ({
            //     //         ...params,
            //     //         priorityErrors: omit(params.priorityErrors, input.name),
            //     //     }),
            //     // });
            // }

            setSchemaMutators?.({
                headName: 'qwe.test.jajaja',
                // mutators: {
                //     [input.name]: {
                //         title: 'Aaaaaaaa',
                //     },
                //     'qwe.test.jajaja.stringPattern': {
                //         title: 'OOOOOOO',
                //     },
                //     'qwe.test.jajaja.numberMinimum': {
                //         minimum: 0,
                //     },
                // },
                mutators: [
                    {
                        name: input.name,
                        schema: {
                            title: `${input.value}`,
                            maxLength: `${input.value}`.length - 1,
                            entityParameters: {
                                validatorType: '',
                                errorMessages: {
                                    maxLength: `${input.value}`.length - 1 + ' maxLength',
                                },
                            },
                        },
                    },
                    {
                        name: 'qwe.test.jajaja.stringPattern',
                        schema: {
                            title: `${input.value}`,
                            entityParameters: {
                                validatorType: '',
                                errorMessages: {
                                    pattern: `${input.value}`.length - 1 + ' pattern',
                                },
                            },
                        },
                    },
                ],
            });
            // setExternalErrors?.({
            //     headName: 'qwe.test.jajaja',
            //     priorityErrors: {
            //         'qwe.test.jajaja.stringEnum': `${input.value}`,
            //     },
            // });
        }
    }, [input.value]);

    // if (spec.viewSpec.type === 'password') {
    if (schema.entityParameters?.viewType === 'password') {
        return <PasswordInput {...props} autoComplete="new-password" />;
    }

    return <TextInput {...props} type="text" />;
};

export const Text = React.memo(Component);
