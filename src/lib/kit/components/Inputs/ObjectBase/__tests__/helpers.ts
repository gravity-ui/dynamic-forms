import {FormValue, ObjectSpec, SpecTypes} from '../../../../../core';

export const OBJECT_BASE: Record<string, ObjectSpec> = {
    default: {
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
            layout: 'accordeon',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
    defaultValue: {
        defaultValue: {
            name: 'name',
            age: 10,
        },
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
            layout: 'accordeon',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
    required: {
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
            layout: 'accordeon',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
    desription: {
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
            layout: 'accordeon',
            layoutDescription: 'desription',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
    section: {
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
            layout: 'section',
            layoutTitle: 'Candidate',
            layoutOpen: true,
            layoutDescription: 'desription',
        },
    },
    section2: {
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
            layout: 'section2',
            layoutTitle: 'Candidate',
            layoutOpen: true,
            layoutDescription: 'desription',
        },
    },
    group: {
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
            layout: 'group',
            layoutTitle: 'Candidate',
            layoutOpen: true,
            layoutDescription: 'desription',
        },
    },
    group2: {
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
            layout: 'group2',
            layoutTitle: 'Candidate',
            layoutOpen: true,
            layoutDescription: 'desription',
        },
    },
    transparent: {
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
            layout: 'transparent',
            layoutTitle: 'Candidate',
            layoutOpen: true,
            layoutDescription: 'desription',
        },
    },
    card_accordeon: {
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
            layout: 'card_accordeon',
            layoutTitle: 'Candidate',
            layoutOpen: true,
            layoutDescription: 'desription',
        },
    },
    card_section: {
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
            layout: 'card_section',
            layoutTitle: 'Candidate',
            layoutOpen: true,
            layoutDescription: 'desription',
        },
    },
};

export const VALUE: FormValue = {
    name: 'name',
    age: 10,
};
