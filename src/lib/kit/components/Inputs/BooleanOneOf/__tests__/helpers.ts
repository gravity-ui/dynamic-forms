import {FormValue, ObjectSpec, SpecTypes} from '../../../../../core';

export const BOOLEAN_ONEOF: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
        },
    },
    defaultValueObject: {
        defaultValue: {
            value: false,
            false: {name: 'name', age: 10},
        },
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
        },
    },
    defaultValueString: {
        defaultValue: {
            value: true,
            true: 'Description',
        },
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
        },
    },
    desription: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
            layoutDescription: 'Description',
        },
    },
    row_verbose: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof',
            layout: 'row_verbose',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
            layoutDescription: 'Description',
        },
    },
    transparent: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof',
            layout: 'transparent',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
            layoutDescription: 'Description',
        },
    },
};

export const VALUE: Record<string, FormValue> = {
    false: {
        value: false,
        false: {name: 'name', age: 10},
    },
    true: {
        value: true,
        true: 'Description',
    },
};

export const BOOLEAN_ONEOF_FALT: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof_flat',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
        },
    },
    desription: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof_flat',
            layout: 'row',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
            layoutDescription: 'Description',
        },
    },
    row_verbose: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof_flat',
            layout: 'row_verbose',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
            layoutDescription: 'Description',
        },
    },
    transparent: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: '',
                },
            },
            true: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'textarea',
                    layout: 'row',
                    layoutTitle: 'Description',
                },
            },
            false: {
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
        },
        viewSpec: {
            type: 'boolean_oneof_flat',
            layout: 'transparent',
            layoutTitle: 'Candidate',
            order: ['value', 'false', 'true'],
        },
    },
};
