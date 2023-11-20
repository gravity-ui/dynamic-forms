import React from 'react';

import {act, render} from '@testing-library/react';
import {FormApi} from 'final-form';
import _ from 'lodash';
import {Form, useForm} from 'react-final-form';

import {ErrorMessages, dynamicConfig} from '../../../../kit';
import {SpecTypes} from '../../../constants';
import {ObjectSpec} from '../../../types';
import {DynamicField} from '../DynamicField';
import {FieldArrayValue, WonderMirror} from '../types';
import {transformArrOut} from '../utils';

const name = 'name';
const spec: ObjectSpec = {
    required: true,
    type: SpecTypes.Object,
    properties: {
        id: {
            minimum: 10,
            type: SpecTypes.Number,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'id'},
        },
        name: {
            required: true,
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name'},
        },
        description: {
            required: true,
            type: SpecTypes.String,
            viewSpec: {type: 'textarea', layout: 'row', layoutTitle: 'Description'},
        },
        settings: {
            required: true,
            type: SpecTypes.Boolean,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Settings'},
        },
        autor: {
            required: true,
            type: SpecTypes.Object,
            properties: {
                internal: {
                    required: true,
                    type: SpecTypes.String,
                    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Person id'},
                },
                empty: {
                    required: true,
                    type: SpecTypes.Object,
                    viewSpec: {type: '', layoutTitle: 'Empty'},
                },
                external: {
                    required: true,
                    type: SpecTypes.Object,
                    properties: {
                        name: {
                            required: true,
                            type: SpecTypes.String,
                            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name'},
                        },
                        age: {
                            required: true,
                            type: SpecTypes.Number,
                            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Age'},
                        },
                        license: {
                            required: true,
                            type: SpecTypes.Boolean,
                            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'License'},
                        },
                    },
                    viewSpec: {
                        type: 'base',
                        layoutTitle: 'Person data',
                    },
                },
            },
            description: {
                external: 'External autor',
                internal: 'Internal autor',
                empty: 'None',
            },
            viewSpec: {
                type: 'oneof',
                layout: 'row',
                layoutTitle: 'Autor',
                order: ['external', 'internal', 'empty'],
            },
        },
        labels: {
            minLength: BigInt(1),
            maxLength: BigInt(3),
            type: SpecTypes.Array,
            items: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Label',
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'accordeon',
                layoutTitle: 'Labels',
                layoutOpen: true,
                itemLabel: 'Add element',
            },
        },
        additional: {
            type: SpecTypes.Object,
            properties: {
                surname: {
                    required: true,
                    type: SpecTypes.String,
                    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Surname'},
                },
                username: {
                    required: true,
                    type: SpecTypes.String,
                    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Username'},
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'accordeon',
                layoutTitle: 'Additional',
            },
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'section',
        layoutTitle: 'Candidate',
    },
};

jest.mock('lodash/debounce', () => (f: Function) => f);

test('Form/hooks/DynamicField', () => {
    const mirror: WonderMirror = {field: {}, controller: {}};
    let form = null as FormApi | null;

    render(
        <Form initialValues={{}} onSubmit={_.noop}>
            {() => {
                const Caller = () => {
                    form = useForm();

                    return null;
                };

                return (
                    <React.Fragment>
                        <DynamicField
                            name={name}
                            spec={spec}
                            config={dynamicConfig}
                            __mirror={mirror}
                        />
                        <Caller />
                    </React.Fragment>
                );
            }}
        </Form>,
    );

    const value = {
        name: {
            autor: {
                external: {},
            },
        },
    };

    const errors = {
        name: undefined,
        'name.name': ErrorMessages.REQUIRED,
        'name.description': ErrorMessages.REQUIRED,
        'name.settings': ErrorMessages.REQUIRED,
        'name.autor': undefined,
        'name.autor.external': undefined,
        'name.autor.external.name': ErrorMessages.REQUIRED,
        'name.autor.external.age': ErrorMessages.REQUIRED,
        'name.autor.external.license': ErrorMessages.REQUIRED,
        'name.labels': ErrorMessages.minLengthArr(1),
    };

    expect(mirror.field.useStore?.store.values[name]).toMatchObject(value[name]);
    expect(form?.getState().values[name]).toMatchObject(value[name]);
    expect(mirror.field.useStore?.store.errors).toMatchObject(errors);
    expect(form?.getState().errors?.[name]).toBe(
        _.values(mirror.field.useStore?.store.errors)
            .reverse()
            .find((err) => Boolean(err)),
    );

    act(() => {
        mirror.controller?.['name.additional']?.useField?.input.onChange({});
    });

    const value1 = {
        name: {
            autor: {
                external: {},
            },
            additional: {},
        },
    };

    const errors1 = {
        name: undefined,
        'name.name': ErrorMessages.REQUIRED,
        'name.description': ErrorMessages.REQUIRED,
        'name.settings': ErrorMessages.REQUIRED,
        'name.autor': undefined,
        'name.autor.external': undefined,
        'name.autor.external.name': ErrorMessages.REQUIRED,
        'name.autor.external.age': ErrorMessages.REQUIRED,
        'name.autor.external.license': ErrorMessages.REQUIRED,
        'name.labels': ErrorMessages.minLengthArr(1),
        'name.additional': undefined,
        'name.additional.surname': ErrorMessages.REQUIRED,
        'name.additional.username': ErrorMessages.REQUIRED,
    };

    expect(mirror.field.useStore?.store.values[name]).toMatchObject(value1[name]);
    expect(form?.getState().values[name]).toMatchObject(value1[name]);
    expect(mirror.field.useStore?.store.errors).toMatchObject(errors1);
    expect(form?.getState().errors?.[name]).toBe(
        _.values(mirror.field.useStore?.store.errors)
            .reverse()
            .find((err) => Boolean(err)),
    );

    act(() => {
        mirror.controller?.['name.autor']?.useField?.input.onDrop();
    });

    const value2 = {
        name: {
            autor: undefined,
            additional: {},
        },
    };

    const errors2 = {
        name: undefined,
        'name.name': ErrorMessages.REQUIRED,
        'name.description': ErrorMessages.REQUIRED,
        'name.settings': ErrorMessages.REQUIRED,
        'name.autor': ErrorMessages.REQUIRED,
        'name.labels': ErrorMessages.minLengthArr(1),
        'name.additional': undefined,
        'name.additional.surname': ErrorMessages.REQUIRED,
        'name.additional.username': ErrorMessages.REQUIRED,
    };

    expect(mirror.field.useStore?.store.values[name]).toMatchObject(value2[name]);
    expect(form?.getState().values[name]).toMatchObject(value2[name]);
    expect(mirror.field.useStore?.store.errors).toMatchObject(errors2);
    expect(form?.getState().errors?.[name]).toBe(
        _.values(mirror.field.useStore?.store.errors)
            .reverse()
            .find((err) => Boolean(err)),
    );

    act(() => {
        mirror.controller?.['name']?.useField?.input.onDrop();
    });

    const value3 = {
        name: undefined,
    };

    const errors3 = {
        name: ErrorMessages.REQUIRED,
    };

    expect(mirror.field.useStore?.store.values[name]).toBe(value3[name]);
    expect(form?.getState().values[name]).toBe(value3[name]);
    expect(mirror.field.useStore?.store.errors).toMatchObject(errors3);
    expect(form?.getState().errors?.[name]).toBe(
        _.values(mirror.field.useStore?.store.errors)
            .reverse()
            .find((err) => Boolean(err)),
    );

    act(() => {
        mirror.controller?.['name']?.useField?.input.onChange({});
    });

    act(() => {
        mirror.controller?.['name.labels']?.useField?.input.onChange([
            'foo',
            'bar',
            'rab',
            'oof',
        ] as unknown as FieldArrayValue);
    });

    const value4 = {
        name: {
            autor: {
                external: {},
            },
            labels: {
                '____arr-obj': true,
                '____arr-obj-cnt': 4,
                '<0>': 'foo',
                '<1>': 'bar',
                '<2>': 'rab',
                '<3>': 'oof',
            },
        },
    };

    const errors4 = {
        name: undefined,
        'name.id': false,
        'name.name': ErrorMessages.REQUIRED,
        'name.description': ErrorMessages.REQUIRED,
        'name.settings': ErrorMessages.REQUIRED,
        'name.autor': undefined,
        'name.autor.external': undefined,
        'name.autor.external.name': ErrorMessages.REQUIRED,
        'name.autor.external.age': ErrorMessages.REQUIRED,
        'name.autor.external.license': ErrorMessages.REQUIRED,
        'name.labels': ErrorMessages.maxLengthArr(3),
    };

    expect(mirror.field.useStore?.store.values[name]).toMatchObject(value4[name]);
    expect(form?.getState().values[name]).toMatchObject(transformArrOut(value4)[name]);
    expect(mirror.field.useStore?.store.errors).toMatchObject(errors4);
    expect(form?.getState().errors?.[name]).toBe(
        _.values(mirror.field.useStore?.store.errors)
            .reverse()
            .find((err) => Boolean(err)),
    );

    act(() => {
        mirror.controller?.['name.labels']?.useField?.arrayInput.onItemAdd('foobar');
    });

    act(() => {
        mirror.controller?.['name.labels']?.useField?.arrayInput.onItemRemove('0');
    });

    act(() => {
        mirror.controller?.['name.labels']?.useField?.arrayInput.onItemRemove('1');
    });

    const value5 = {
        name: {
            autor: {
                external: {},
            },
            labels: {
                '____arr-obj': true,
                '____arr-obj-cnt': 5,
                '<2>': 'rab',
                '<3>': 'oof',
                '<4>': 'foobar',
            },
        },
    };

    const errors5 = {
        name: undefined,
        'name.id': false,
        'name.name': ErrorMessages.REQUIRED,
        'name.description': ErrorMessages.REQUIRED,
        'name.settings': ErrorMessages.REQUIRED,
        'name.autor': undefined,
        'name.autor.external': undefined,
        'name.autor.external.name': ErrorMessages.REQUIRED,
        'name.autor.external.age': ErrorMessages.REQUIRED,
        'name.autor.external.license': ErrorMessages.REQUIRED,
    };

    expect(mirror.field.useStore?.store.values[name]).toMatchObject(value5[name]);
    expect(form?.getState().values[name]).toMatchObject(transformArrOut(value5)[name]);
    expect(mirror.field.useStore?.store.errors).toMatchObject(errors5);
    expect(form?.getState().errors?.[name]).toBe(
        _.values(mirror.field.useStore?.store.errors)
            .reverse()
            .find((err) => Boolean(err)),
    );
});
