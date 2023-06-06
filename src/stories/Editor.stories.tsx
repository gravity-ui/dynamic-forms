import React from 'react';

import {ComponentStory} from '@storybook/react';

import {ArrayBase, ObjectSpec, SpecTypes} from '../lib';

import {Editor as EditorBase} from './components/Editor/Editor';

export default {
    title: 'Other/Editor',
    component: EditorBase,
};

const spec: ObjectSpec = {
    required: true,
    type: SpecTypes.Object,
    properties: {
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
                viewSpec: {
                    layout: 'TRANSPARENT',
                    type: 'base',
                    layoutTitle: '',
                },
                type: SpecTypes.Object,
                properties: {
                    data: {
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
                                        viewSpec: {
                                            type: 'base',
                                            layout: 'row',
                                            layoutTitle: 'Name',
                                        },
                                    },
                                    age: {
                                        type: SpecTypes.Number,
                                        viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Age'},
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
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'SECTION',
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

const value = {};

const template = () => {
    const Template: ComponentStory<typeof ArrayBase> = (__, {viewMode}) => (
        <EditorBase spec={spec} value={value} viewMode={viewMode} />
    );

    return Template;
};

export const Editor = template();
