import {ArraySpec, FormValue, ObjectSpec, SpecTypes} from '../../../../../core';

export const SECTION: Record<string, ArraySpec | ObjectSpec> = {
    sectionArraySpec: {
        defaultValue: ['value'],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Element',
            },
        },
        viewSpec: {
            type: 'base',
            layout: 'section',
            layoutTitle: 'Accordeon Card',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    sectionObjectSpec: {
        defaultValue: {
            name: 'value',
            age: 10,
            license: false,
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
            layout: 'section',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
    section2ArraySpec: {
        defaultValue: ['value'],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Element',
            },
        },
        viewSpec: {
            type: 'base',
            layout: 'section2',
            layoutTitle: 'Accordeon Card',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    section2ObjectSpec: {
        defaultValue: {
            name: 'value',
            age: 10,
            license: false,
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
            layout: 'section2',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
    groupArraySpec: {
        defaultValue: ['value'],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Element',
            },
        },
        viewSpec: {
            type: 'base',
            layout: 'group',
            layoutTitle: 'Accordeon Card',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    groupObjectSpec: {
        defaultValue: {
            name: 'value',
            age: 10,
            license: false,
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
            layout: 'group',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
    group2ArraySpec: {
        defaultValue: ['value'],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Element',
            },
        },
        viewSpec: {
            type: 'base',
            layout: 'group2',
            layoutTitle: 'Accordeon Card',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    group2ObjectSpec: {
        defaultValue: {
            name: 'value',
            age: 10,
            license: false,
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
            layout: 'group2',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
};

export const VALUE: Record<string, FormValue> = {
    array: ['value', 'value'],
    object: {
        name: 'name',
        age: 21,
        license: true,
    },
};
