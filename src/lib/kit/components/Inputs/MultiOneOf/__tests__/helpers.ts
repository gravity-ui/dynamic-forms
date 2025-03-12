import type {FormValue, ObjectSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const MULTI_ONEOF: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
        },
    },
    defaultValuePerson: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
        },
    },
    defaultValueFull: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
            id: '123456789',
            license: true,
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
        },
    },
    required: {
        required: true,
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
        },
    },
    desription: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
            layoutDescription: 'desription',
        },
    },
    row_verbose: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof',
            layout: 'row_verbose',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
            layoutDescription: 'desription',
        },
    },
    transparent: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof',
            layout: 'transparent',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
            layoutDescription: 'desription',
        },
    },
};

export const VALUE: Record<string, FormValue> = {
    person: {
        person: {
            name: 'Bar',
            age: 20,
        },
    },
    full: {
        person: {
            name: 'Bar',
            age: 20,
        },
        id: '123456789',
        license: true,
    },
};

export const MULTI_ONEOF_FALT: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof_flat',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
        },
    },
    defaultValuePerson: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof_flat',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
        },
    },
    defaultValueFull: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
            id: '123456789',
            license: true,
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof_flat',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
        },
    },
    required: {
        required: true,
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof_flat',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
        },
    },
    desription: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof_flat',
            layout: 'row',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
            layoutDescription: 'desription',
        },
    },
    row_verbose: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof_flat',
            layout: 'row_verbose',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
            layoutDescription: 'desription',
        },
    },
    transparent: {
        defaultValue: {
            person: {
                name: 'Bar',
                age: 20,
            },
        },
        type: SpecTypes.Object,
        properties: {
            person: {
                required: true,
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Name',
                        },
                    },
                    age: {
                        type: SpecTypes.Number,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'Age',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                },
            },
            id: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            license: {
                required: true,
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'license',
                },
            },
        },
        description: {
            person: 'Person Data',
            id: 'Person id',
            license: 'License',
        },
        viewSpec: {
            type: 'multi_oneof_flat',
            layout: 'transparent',
            layoutTitle: 'Multi OneOf',
            placeholder: 'placeholder text',
            layoutDescription: 'desription',
        },
    },
};
