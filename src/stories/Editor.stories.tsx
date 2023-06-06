import React from 'react';

import {ComponentStory} from '@storybook/react';

import {ArrayBase, ObjectSpec, SpecTypes} from '../lib';

import {Editor as EditorBase} from './components/Editor/Editor';

export default {
    title: 'Other/Editor',
    component: EditorBase,
};

const spec: ObjectSpec = {
    defaultValue: {
        id: 12345,
        name: 'Foo',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quod error voluptatibus odio minima assumenda voluptatum harum quidem maxime iste exercitationem, quam numquam, necessitatibus saepe praesentium, commodi beatae. Vitae, odit. Assumenda nobis similique voluptatibus? Sint itaque qui laudantium iste? In doloribus nam vitae quasi suscipit dolores maiores culpa amet quo. Distinctio mollitia ad expedita tempore sit? Nemo odit quae impedit?',
        labels: ['foo', 'bar', 'rab', 'oof'],
        settings: true,
        autor: {
            external: {
                name: 'Bar',
                age: 12345,
                license: true,
            },
        },
    },
    required: true,
    type: SpecTypes.Object,
    properties: {
        id: {
            type: SpecTypes.Number,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'id'},
        },
        name: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name'},
        },
        description: {
            type: SpecTypes.String,
            viewSpec: {type: 'textarea', layout: 'row', layoutTitle: 'Description'},
        },
        settings: {
            type: SpecTypes.Boolean,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Settings'},
        },
        autor: {
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
                            type: SpecTypes.String,
                            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name'},
                        },
                        age: {
                            type: SpecTypes.Number,
                            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Age'},
                        },
                        license: {
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
    },
    viewSpec: {
        type: 'base',
        layout: 'section',
        layoutTitle: 'Candidate',
    },
};

const template = () => {
    const Template: ComponentStory<typeof ArrayBase> = (__, {viewMode}) => (
        <EditorBase spec={spec} viewMode={viewMode} />
    );

    return Template;
};

export const Editor = template();
