import {FormValue, ObjectSpec, SpecTypes} from '../../../../../core';

export const ONEOF: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    defaultValueObject: {
        defaultValue: {
            external: {
                name: 'name',
                age: 10,
            },
        },
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    defaultValueString: {
        defaultValue: {
            internal: 'internal',
        },
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    required: {
        required: true,
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    desription: {
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            layoutDescription: 'desription',
            order: ['external', 'internal', 'empty'],
        },
    },
    row_verbose: {
        required: true,
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof',
            layout: 'row_verbose',
            layoutDescription: 'desription',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    transparent: {
        required: true,
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof',
            layout: 'transparent',
            layoutDescription: 'desription',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    defaultCheckbox: {
        type: SpecTypes.Object,
        defaultValue: {
            external: {
                name: 'name',
                age: 10,
            },
        },
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
        },
        viewSpec: {
            type: 'oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['external', 'internal'],
            oneOfParams: {
                toggler: 'checkbox',
                booleanMap: {
                    true: 'external',
                    false: 'internal',
                },
            },
        },
    },
};

export const VALUE: Record<string, FormValue> = {
    object: {
        external: {
            name: 'name',
            age: 10,
        },
    },
    string: {
        internal: 'internal',
    },
};

export const ONEOF_FALT: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof_flat',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    required: {
        required: true,
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof_flat',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    desription: {
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof_flat',
            layout: 'row',
            layoutTitle: 'Candidate',
            layoutDescription: 'desription',
            order: ['external', 'internal', 'empty'],
        },
    },
    row_verbose: {
        required: true,
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof_flat',
            layout: 'row_verbose',
            layoutDescription: 'desription',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    transparent: {
        required: true,
        type: SpecTypes.Object,
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
            empty: {
                required: true,
                type: SpecTypes.Object,
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Empty',
                },
                properties: {},
            },
        },
        description: {
            internal: 'Internal candidate',
            empty: 'None',
            external: 'External candidate',
        },
        viewSpec: {
            type: 'oneof_flat',
            layout: 'transparent',
            layoutDescription: 'desription',
            layoutTitle: 'Candidate',
            order: ['external', 'internal', 'empty'],
        },
    },
    defaultCheckbox: {
        type: SpecTypes.Object,
        defaultValue: {
            internal: 'string',
        },
        properties: {
            external: {
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
                    license: {
                        type: SpecTypes.Boolean,
                        viewSpec: {
                            type: 'base',
                            layout: 'row',
                            layoutTitle: 'License',
                        },
                    },
                },
                viewSpec: {
                    type: 'base',
                    layoutTitle: 'Person data',
                },
            },
            internal: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Person id',
                },
            },
        },
        viewSpec: {
            type: 'oneof_flat',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['external', 'internal'],
            oneOfParams: {
                toggler: 'checkbox',
                booleanMap: {
                    true: 'external',
                    false: 'internal',
                },
            },
        },
    },
};
